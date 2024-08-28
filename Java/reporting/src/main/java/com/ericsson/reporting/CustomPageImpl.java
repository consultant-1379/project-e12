package com.ericsson.reporting;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

public class CustomPageImpl<R> extends PageImpl {
    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public CustomPageImpl(@JsonProperty("content") List content, @JsonProperty("number") int number,
                          @JsonProperty("size") int size, @JsonProperty("totalElements") Long totalElements,
                          @JsonProperty("pageable") JsonNode pageable, @JsonProperty("last") boolean last,
                          @JsonProperty("totalPages") int totalPages, @JsonProperty("sort") JsonNode sort,
                          @JsonProperty("numberOfElements") int numberOfElements) {
        super(content, PageRequest.of(number, 1), 10);
    }
    public CustomPageImpl(List content, Pageable pageable, long total) {
        super(content, pageable, total);
    }

    public CustomPageImpl(List content) {
        super(content);
    }

    public CustomPageImpl() {
        super(new ArrayList<>());
    }
}
