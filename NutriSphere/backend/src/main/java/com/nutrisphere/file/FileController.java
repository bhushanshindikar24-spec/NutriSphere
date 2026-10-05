package com.nutrisphere.file;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.file.dto.FileUploadResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
@RestController @RequestMapping("/api/files") @RequiredArgsConstructor
public class FileController {
    private final FileStorageService fileStorageService;
    private final SecurityUtils securityUtils;

    @PostMapping("/upload")
    public ApiResponse<FileUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "general") String category,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long entityId) {
        return ApiResponse.success(fileStorageService.store(file, securityUtils.getCurrentUserId(), category, entityType, entityId));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Resource resource = fileStorageService.loadAsResource(id, securityUtils.getCurrentUserId());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
