package com.ericsson.reporting;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "scan_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date scanDate;

    @Column(name = "vulnerabilities", columnDefinition = "TEXT")
    private String vulnerabilities;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Date getScanDate() {
        return scanDate;
    }

    public void setScanDate(Date scanDate) {
        this.scanDate = scanDate;
    }

    public String getVulnerabilities() {
        return vulnerabilities;
    }

    public void setVulnerabilities(String vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }
}
