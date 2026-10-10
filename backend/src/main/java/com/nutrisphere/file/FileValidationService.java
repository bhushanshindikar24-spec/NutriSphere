package com.nutrisphere.file;

import com.nutrisphere.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class FileValidationService {
    @Value("${app.file.max-size:10485760}")
    private long maxSize;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
        "image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"
    );

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (file.getSize() > maxSize) {
            throw new BadRequestException("File too large. Max: " + (maxSize / 1024 / 1024) + "MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("File type not allowed: " + contentType);
        }

        String filename = file.getOriginalFilename();
        if (filename == null || filename.isBlank() || filename.contains("/") || filename.contains("\\") ||
                filename.contains("..")) {
            throw new BadRequestException("Invalid filename");
        }

        try {
            byte[] bytes = file.getBytes();
            if (!hasExpectedSignature(contentType.toLowerCase(), bytes)) {
                throw new BadRequestException("File content does not match the declared type");
            }
        } catch (IOException e) {
            throw new BadRequestException("Unable to inspect uploaded file");
        }
    }

    public void validatePathSegment(String value, String fieldName) {
        if (value == null || !value.matches("[A-Za-z0-9_-]{1,50}")) {
            throw new BadRequestException("Invalid " + fieldName);
        }
    }

    private boolean hasExpectedSignature(String contentType, byte[] b) {
        if (b.length < 4) return false;

        return switch (contentType) {
            case "application/pdf" -> b[0] == '%' && b[1] == 'P' && b[2] == 'D' && b[3] == 'F';
            case "image/jpeg" -> (b[0] & 0xff) == 0xff && (b[1] & 0xff) == 0xd8 && (b[2] & 0xff) == 0xff;
            case "image/png" -> b.length >= 8 &&
                b[0] == (byte)0x89 && b[1] == 0x50 && b[2] == 0x4e && b[3] == 0x47 &&
                b[4] == 0x0d && b[5] == 0x0a && b[6] == 0x1a && b[7] == 0x0a;
            case "image/gif" -> b.length >= 6 &&
                ((b[0] == 'G' && b[1] == 'I' && b[2] == 'F' && b[3] == '8' && (b[4] == '7' || b[4] == '9') && b[5] == 'a'));
            case "image/webp" -> b.length >= 12 &&
                b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F' &&
                b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';
            default -> false;
        };
    }
}
