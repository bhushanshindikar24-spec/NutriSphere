package com.nutrisphere.file;

import com.nutrisphere.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class FileValidationServiceTest {

    private FileValidationService service;

    @BeforeEach
    void setUp() {
        service = new FileValidationService();
        ReflectionTestUtils.setField(service, "maxSize", 10485760L); // 10MB
    }

    @Test
    void validate_NullOrEmptyFile_ThrowsBadRequest() {
        assertThrows(BadRequestException.class, () -> service.validate(null));

        MockMultipartFile emptyFile = new MockMultipartFile("file", "test.png", "image/png", new byte[0]);
        assertThrows(BadRequestException.class, () -> service.validate(emptyFile));
    }

    @Test
    void validate_OversizedFile_ThrowsBadRequest() {
        ReflectionTestUtils.setField(service, "maxSize", 10L); // 10 bytes limit
        byte[] bytes = new byte[20];
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", bytes);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.validate(file));
        assertTrue(ex.getMessage().contains("File too large"));
    }

    @Test
    void validate_InvalidContentType_ThrowsBadRequest() {
        MockMultipartFile file = new MockMultipartFile("file", "script.sh", "application/x-sh", new byte[]{1, 2, 3, 4});
        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.validate(file));
        assertTrue(ex.getMessage().contains("File type not allowed"));
    }

    @Test
    void validate_PathTraversalFilename_ThrowsBadRequest() {
        byte[] pdfBytes = "%PDF-1.4 test".getBytes();
        MockMultipartFile fileTraversal = new MockMultipartFile("file", "../secret.pdf", "application/pdf", pdfBytes);
        assertThrows(BadRequestException.class, () -> service.validate(fileTraversal));

        MockMultipartFile fileSlash = new MockMultipartFile("file", "dir/secret.pdf", "application/pdf", pdfBytes);
        assertThrows(BadRequestException.class, () -> service.validate(fileSlash));
    }

    @Test
    void validate_ValidPdf_Passes() {
        byte[] pdfBytes = "%PDF-1.4 file content".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "report.pdf", "application/pdf", pdfBytes);

        assertDoesNotThrow(() -> service.validate(file));
    }

    @Test
    void validate_ValidPng_Passes() {
        byte[] pngHeader = new byte[]{(byte)0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0};
        MockMultipartFile file = new MockMultipartFile("file", "photo.png", "image/png", pngHeader);

        assertDoesNotThrow(() -> service.validate(file));
    }

    @Test
    void validate_ValidJpeg_Passes() {
        byte[] jpegHeader = new byte[]{(byte)0xff, (byte)0xd8, (byte)0xff, (byte)0xe0, 0, 0};
        MockMultipartFile file = new MockMultipartFile("file", "photo.jpg", "image/jpeg", jpegHeader);

        assertDoesNotThrow(() -> service.validate(file));
    }

    @Test
    void validate_SignatureMismatch_ThrowsBadRequest() {
        byte[] fakeBytes = "NOT_A_REAL_PNG_FILE".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "fake.png", "image/png", fakeBytes);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.validate(file));
        assertTrue(ex.getMessage().contains("does not match the declared type"));
    }

    @Test
    void validatePathSegment_ValidAndInvalid() {
        assertDoesNotThrow(() -> service.validatePathSegment("clinical_reports_2026", "folder"));
        assertThrows(BadRequestException.class, () -> service.validatePathSegment("../etc", "folder"));
        assertThrows(BadRequestException.class, () -> service.validatePathSegment("invalid space", "folder"));
        assertThrows(BadRequestException.class, () -> service.validatePathSegment(null, "folder"));
    }
}
