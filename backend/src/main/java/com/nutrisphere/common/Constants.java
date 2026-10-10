package com.nutrisphere.common;

public final class Constants {
    private Constants() {}
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    public static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg","image/png","image/gif","image/webp"};
    public static final String[] ALLOWED_DOCUMENT_TYPES = {"application/pdf","image/jpeg","image/png"};
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String ROLE_DOCTOR = "ROLE_DOCTOR";
    public static final String ROLE_DIETITIAN = "ROLE_DIETITIAN";
    public static final String ROLE_PATIENT = "ROLE_PATIENT";
    public static final String ROLE_HOTEL = "ROLE_HOTEL";
}
