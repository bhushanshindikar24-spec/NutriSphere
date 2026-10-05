package com.nutrisphere.file.dto;
import lombok.Data;
@Data
public class FileUploadResponse {
    private Long id;
    private String originalFilename;
    private String downloadUrl;
    private String contentType;
    private Long fileSize;
    private boolean success;
    private String message;
}
