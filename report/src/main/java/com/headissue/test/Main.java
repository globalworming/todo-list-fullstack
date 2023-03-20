package com.headissue.test;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;

import com.google.cloud.Timestamp;
import com.google.cloud.bigquery.*;
import org.threeten.bp.DateTimeException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;


public class Main {
    private static final BigQuery bigquery = BigQueryOptions.getDefaultInstance().getService();

    public static void main(String[] args) {
        try {
            Arguments arguments = parse(args);
            List<TestResult> results = new ArrayList<>();

            File dir = arguments.dir();

            List<Path> xmlTestResults;
            try (Stream<Path> stream = Files.list(dir.toPath())) {
                xmlTestResults = stream
                        .filter(path -> path.getFileName().toString().endsWith(".xml"))
                        .filter(path -> path.getFileName().toString().startsWith("TEST-") || path.getFileName().toString().startsWith("junit") || path.getFileName().toString().startsWith("test-results") || path.getFileName().toString().startsWith("newman-run-report"))
                        .collect(Collectors.toList());
            }

            for (Path xmlTestResult : xmlTestResults) {

                DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
                DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
                Document doc = dBuilder.parse(xmlTestResult.toFile());

                doc.getDocumentElement().normalize();

                NodeList testsuites = doc.getElementsByTagName("testsuite");
                for (int k = 0; k < testsuites.getLength(); k++) {
                    Element testsuite = (Element) doc.getElementsByTagName("testsuite").item(k);
                    NodeList testcaseNodes = testsuite.getElementsByTagName("testcase");


                    for (int i = 0; i < testcaseNodes.getLength(); i++) {
                        Element testcaseNode = (Element) testcaseNodes.item(i);
                        String scenario = testcaseNode.getAttribute("name")
                                .replaceAll("([a-z])([A-Z])", "$1 $2")
                                .replace("()", "")
                                .toLowerCase();
                        String name = testsuite.getAttribute("name");
                        if (testsuite.getAttribute("package").length() > 0) {
                            name = testsuite.getAttribute("package");
                        }
                        List<String> classname = Arrays.stream(name.split("\\."))
                                .toList();
                        if (classname.size() == 1 && classname.get(0).contains(" / ")) {
                            classname = Arrays.stream(classname.get(0).split(" \\/ ")).toList();
                        }
                        String feature = classname.get(classname.size() - 1)
                                .replaceAll("Test$", "")
                                .replaceAll("([a-z])([A-Z])", "$1 $2")
                                .toLowerCase();
                        String capability = classname.get(classname.size() - 2);
                        String status = "success";
                        if (testcaseNode.getElementsByTagName("failure").getLength() > 0) {
                            status = "failure";
                        }
                        if (testcaseNode.getElementsByTagName("error").getLength() > 0) {
                            status = "error";
                        }
                        if (testcaseNode.getElementsByTagName("skipped").getLength() > 0) {
                            status = "skipped";
                        }

                        String timestamp = testsuite.getAttribute("timestamp");

                        Timestamp gcloudTimestamp;
                        try {
                            gcloudTimestamp = Timestamp.parseTimestamp(timestamp);
                        } catch (DateTimeException e) {
                            gcloudTimestamp = Timestamp.now();
                        }
                        TestResult testResult = new TestResult(
                                capability, feature, scenario, status, arguments.user(), arguments.branch(), status, gcloudTimestamp, arguments.system(), arguments.location(), arguments.isolation(), arguments.source()
                        );
                        System.out.println(testResult);
                        results.add(testResult);
                    }

                }


            }


            pushToBigQuery(results);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void pushToBigQuery(List<TestResult> testResults) {
        try {

            TableId tableId = TableId.of("test_results", "results");

            InsertAllRequest.Builder request = InsertAllRequest.newBuilder(tableId);
            testResults.forEach(testResult -> {
                Map<String, Object> rowContent = new HashMap<>();
                rowContent.put("capability", testResult.capability());
                rowContent.put("feature", testResult.feature());
                rowContent.put("scenario", testResult.scenario());
                rowContent.put("result", testResult.result());
                rowContent.put("timestamp", testResult.timestamp().getSeconds());
                rowContent.put("user", testResult.user());
                rowContent.put("branch", testResult.branch());
                rowContent.put("system", testResult.system());
                rowContent.put("isolation", testResult.isolation());
                rowContent.put("location", testResult.location());
                rowContent.put("source", testResult.source());
                request.addRow(rowContent);
            });

            InsertAllResponse response = bigquery.insertAll(request.build());

            if (response.hasErrors()) {
                // If any of the insertions failed, this lets you inspect the errors
                for (Map.Entry<Long, List<BigQueryError>> entry : response.getInsertErrors().entrySet()) {
                    System.out.println("Response error: \n" + entry.getValue());
                }
            }
            System.out.println("Rows successfully inserted into table");
        } catch (BigQueryException e) {
            System.out.println("Insert operation not performed \n" + e);
        }
    }

    private static Arguments parse(String[] args) {
        String branch = null;
        String user = null;
        String system = null;
        String location = null;
        String isolation = null;
        String source = null;
        File dir = null;
        for (int i = 0; i < args.length; i++) {
            String arg = args[i];
            switch (arg) {
                case "-u" -> {
                    user = args[i + 1];
                    i++;
                }
                case "-l" -> {
                    location = args[i + 1];
                    i++;
                }
                case "-s" -> {
                    system = args[i + 1];
                    i++;
                }
                case "-i" -> {
                    isolation = args[i + 1];
                    i++;
                }
                case "-b" -> {
                    branch = args[i + 1];
                    i++;
                }
                case "--src" -> {
                    source = args[i + 1];
                    i++;
                }
                default -> dir = new File(arg);
            }
        }

        return new Arguments(branch, user, system, location, isolation, dir, source);
    }
}