package com.nutrisphere.file;
import com.nutrisphere.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Arrays;
import java.util.List;
@Service
public class FileValidationService {
    @Value("${app.file.max-size:10485760}") private long maxSize;
    private static final List<String> ALLOWED_TYPES = Arrays.asList(
        "image/jpeg","image/png","image/gif","image/webp","application/pdf"
    );
    public void validate(MultipartFile file) {
        if (file.isEmpty()) throw new BadRequestException("File is empty");
        if (file.getSize() > maxSize) throw new BadRequestException("File too large. Max: " + (maxSize/1024/1024) + "MB");
        if (!ALLOWED_TYPES.contains(file.getContentType()))
            throw new BadRequestException("File type not allowed: " + file.getContentType());
    }
}
