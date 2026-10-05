package com.nutrisphere.exception;
public class FileStorageException extends RuntimeException {
    public FileStorageException(String msg) { super(msg); }
    public FileStorageException(String msg, Throwable cause) { super(msg, cause); }
}
