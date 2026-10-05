package com.nutrisphere.common;

import lombok.Data;
import java.util.List;

@Data
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public static <T> PageResponse<T> of(List<T> content, int page, int size, long total) {
        PageResponse<T> r = new PageResponse<>();
        r.content = content;
        r.page = page;
        r.size = size;
        r.totalElements = total;
        r.totalPages = (int) Math.ceil((double) total / size);
        r.last = page >= r.totalPages - 1;
        return r;
    }
}
