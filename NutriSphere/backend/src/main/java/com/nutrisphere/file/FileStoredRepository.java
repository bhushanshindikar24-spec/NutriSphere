package com.nutrisphere.file;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface FileStoredRepository extends JpaRepository<StoredFile, Long> {
    List<StoredFile> findByEntityTypeAndEntityId(String entityType, Long entityId);
    List<StoredFile> findByUploaderUserId(Long userId);
}
