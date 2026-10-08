package com.nutrisphere.file;

import com.nutrisphere.exception.*;
import com.nutrisphere.file.dto.*;
import com.nutrisphere.medical.laboratory.LaboratoryReportRepository;
import com.nutrisphere.medical.report.MedicalReportRepository;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {
    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    private final FileStoredRepository fileStoredRepository;
    private final FileValidationService validationService;
    private final SecurityUtils securityUtils;
    private final MedicalReportRepository medicalReportRepository;
    private final LaboratoryReportRepository laboratoryReportRepository;

    @Transactional
    public FileUploadResponse store(MultipartFile file, Long userId, String category,
                                    String entityType, Long entityId) {
        validationService.validate(file);
        validationService.validatePathSegment(category, "category");

        if (entityType != null && !entityType.isBlank()) {
            validationService.validatePathSegment(entityType, "entityType");
            authorizeClinicalEntity(entityType, entityId);
        }

        try {
            String ext = getExtension(file.getOriginalFilename());
            String stored = UUID.randomUUID() + ext;
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(category).normalize();

            if (!dir.startsWith(Paths.get(uploadDir).toAbsolutePath().normalize())) {
                throw new FileStorageException("Invalid upload path");
            }

            Files.createDirectories(dir);
            Path target = dir.resolve(stored).normalize();
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            StoredFile sf = StoredFile.builder()
                .uploaderUserId(userId)
                .originalFilename(file.getOriginalFilename())
                .storedFilename(stored)
                .filePath(target.toString())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .entityType(entityType)
                .entityId(entityId)
                .category(category)
                .build();
            sf = fileStoredRepository.save(sf);

            FileUploadResponse r = new FileUploadResponse();
            r.setId(sf.getId());
            r.setOriginalFilename(file.getOriginalFilename());
            r.setDownloadUrl("/api/files/download/" + sf.getId());
            r.setContentType(file.getContentType());
            r.setFileSize(file.getSize());
            r.setSuccess(true);
            r.setMessage("File uploaded successfully");
            return r;
        } catch (IOException e) {
            throw new FileStorageException("Could not store file", e);
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int idx = filename.lastIndexOf('.');
        return idx > 0 ? filename.substring(idx).toLowerCase(Locale.ROOT) : "";
    }

    @Transactional(readOnly = true)
    public Resource loadAsResource(Long fileId, Long userId) {
        StoredFile sf = fileStoredRepository.findById(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("File", fileId));

        if (!sf.getUploaderUserId().equals(userId)) {
            authorizeClinicalEntityForUser(sf.getEntityType(), sf.getEntityId(), userId);
        }

        try {
            Path base = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path file = Paths.get(sf.getFilePath()).toAbsolutePath().normalize();
            if (!file.startsWith(base)) {
                throw new ForbiddenException("Invalid stored file path");
            }

            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new FileStorageException("Could not read file: " + sf.getOriginalFilename());
        } catch (java.net.MalformedURLException e) {
            throw new FileStorageException("Could not read file: " + sf.getOriginalFilename(), e);
        }
    }

    private void authorizeClinicalEntity(String entityType, Long entityId) {
        if (entityId == null) {
            throw new BadRequestException("entityId is required for clinical files");
        }

        String type = entityType.toUpperCase(Locale.ROOT);
        Long patientUserId = switch (type) {
            case "MEDICAL_REPORT" -> medicalReportRepository.findById(entityId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalReport", entityId))
                .getPatientUserId();
            case "LABORATORY_REPORT", "LAB_REPORT" -> laboratoryReportRepository.findById(entityId)
                .orElseThrow(() -> new ResourceNotFoundException("LaboratoryReport", entityId))
                .getPatientUserId();
            default -> null;
        };

        if (patientUserId != null) {
            securityUtils.assertPatientAccess(patientUserId);
        }
    }

    private void authorizeClinicalEntityForUser(String entityType, Long entityId, Long userId) {
        if (entityType == null || entityId == null) {
            throw new ForbiddenException("Not authorized to download this file");
        }

        String type = entityType.toUpperCase(Locale.ROOT);
        Long patientUserId = switch (type) {
            case "MEDICAL_REPORT" -> medicalReportRepository.findById(entityId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalReport", entityId))
                .getPatientUserId();
            case "LABORATORY_REPORT", "LAB_REPORT" -> laboratoryReportRepository.findById(entityId)
                .orElseThrow(() -> new ResourceNotFoundException("LaboratoryReport", entityId))
                .getPatientUserId();
            default -> null;
        };

        if (patientUserId == null) {
            throw new ForbiddenException("Not authorized to download this file");
        }
        securityUtils.assertPatientAccess(patientUserId);
    }
}
