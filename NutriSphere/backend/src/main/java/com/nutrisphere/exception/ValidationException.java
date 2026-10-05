package com.nutrisphere.exception;
import java.util.List;
public class ValidationException extends RuntimeException {
    private final List<String> errors;
    public ValidationException(String msg) { super(msg); this.errors = List.of(msg); }
    public ValidationException(List<String> errors) { super("Validation failed"); this.errors = errors; }
    public List<String> getErrors() { return errors; }
}
