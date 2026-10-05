package com.nutrisphere.file;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "stored_files")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StoredFile extends BaseEntity {
    @Column(name = "uploader_user_id") private Long uploaderUserId;
    @Column(name = "original_filename", nullable = false) private String originalFilename;
    @Column(name = "stored_filename", nullable = false) private String storedFilename;
    @Column(name = "file_path", nullable = false) private String filePath;
    @Column(name = "content_type") private String contentType;
    @Column(name = "file_size") private Long fileSize;
    @Column(name = "entity_type") private String entityType;
    @Column(name = "entity_id") private Long entityId;
    @Column(name = "category") private String category;
}
