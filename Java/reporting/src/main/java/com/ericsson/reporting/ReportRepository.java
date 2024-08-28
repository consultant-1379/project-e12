package com.ericsson.reporting;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ReportRepository extends CrudRepository<Report, Integer> {
    List<Report> findByProjectName(String projectName);

    List<Report> findByProjectNameContainingIgnoreCase(String projectName);
}
