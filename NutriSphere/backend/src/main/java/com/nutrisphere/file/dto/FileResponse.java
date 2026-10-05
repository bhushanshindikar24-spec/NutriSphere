package com.nutrisphere.file.dto;
import lombok.Data;
@Data
public class FileResponse {
    private Long id;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private String downloadUrl;
    private String category;
}
