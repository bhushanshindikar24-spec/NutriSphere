package com.nutrisphere.file;

import com.nutrisphere.exception.FileStorageException;
import com.nutrisphere.file.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.exception.ForbiddenException;

@Service @RequiredArgsConstructor @Slf4j
public class FileStorageService {
    @Value("${app.file.upload-dir:./uploads}") private String uploadDir;
    private final FileStoredRepository fileStoredRepository;
    private final FileValidationService validationService;

    @Transactional
    public FileUploadResponse store(MultipartFile file, Long userId, String category, String entityType, Long entityId) {
        validationService.validate(file);
        try {
            String ext = getExtension(file.getOriginalFilename());
            String stored = UUID.randomUUID() + ext;
            Path dir = Paths.get(uploadDir, category);
            Files.createDirectories(dir);
            Path target = dir.resolve(stored);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            StoredFile sf = StoredFile.builder()
                .uploaderUserId(userId).originalFilename(file.getOriginalFilename())
                .storedFilename(stored).filePath(target.toString())
                .contentType(file.getContentType()).fileSize(file.getSize())
                .entityType(entityType).entityId(entityId).category(category)
                .build();
            sf = fileStoredRepository.save(sf);

            FileUploadResponse r = new FileUploadResponse();
            r.setId(sf.getId()); r.setOriginalFilename(file.getOriginalFilename());
            r.setDownloadUrl("/api/files/download/" + sf.getId());
            r.setContentType(file.getContentType()); r.setFileSize(file.getSize());
            r.setSuccess(true); r.setMessage("File uploaded successfully");
            return r;
        } catch (IOException e) {
            throw new FileStorageException("Could not store file", e);
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int idx = filename.lastIndexOf('.');
        return idx > 0 ? filename.substring(idx) : "";
    }

    @Transactional(readOnly = true)
    public Resource loadAsResource(Long fileId, Long userId) {
        StoredFile sf = fileStoredRepository.findById(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("File", fileId));
        
        // Very basic object-level authorization: 
        // Only the uploader can access it directly, OR we could add more complex checks.
        // For now, to prevent arbitrary file reading, we enforce the uploader check.
        // In a real app, we'd check if userId is doctor/patient related to entityId.
        if (!sf.getUploaderUserId().equals(userId)) {
             throw new ForbiddenException("Not authorized to download this file");
        }

        try {
            Path file = Paths.get(sf.getFilePath()).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("Could not read file: " + sf.getOriginalFilename());
            }
        } catch (java.net.MalformedURLException e) {
            throw new FileStorageException("Could not read file: " + sf.getOriginalFilename(), e);
        }
    }
}
