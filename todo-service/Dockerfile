FROM gradle:7.2.0-jdk17-alpine as gradle
COPY --chown=gradle . /home/app
WORKDIR /home/app
RUN gradle assemble --no-daemon



FROM openjdk:17-jdk-slim
COPY --from=gradle /home/app/build/libs/*-all.jar app.jar
EXPOSE 8080
CMD java -noverify -jar app.jar