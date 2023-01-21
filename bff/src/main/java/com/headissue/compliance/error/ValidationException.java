package com.headissue.compliance.error;

public class ValidationException extends IllegalArgumentException {
    private final String fieldError;
    private final String path;

    public ValidationException(String type, String fieldError, String path) {
       super("error validating " + type);
        this.fieldError = fieldError;
        this.path = path;
    }

    public String getFieldError() {
        return fieldError;
    }

    public String getPath() {
        return path;
    }
}
