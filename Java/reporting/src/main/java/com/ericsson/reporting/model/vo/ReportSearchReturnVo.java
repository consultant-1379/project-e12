package com.ericsson.reporting.model.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.Date;

public class ReportSearchReturnVo {
    private String projectName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date scanDate;

    private String level;

    private JsonNode vulnerabilities;

    private int vulnerableDependencies;

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

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public JsonNode getVulnerabilities() {
        return vulnerabilities;
    }

    public void setVulnerabilities(JsonNode vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }

    public int getVulnerableDependencies() {
        return vulnerableDependencies;
    }

    public void setVulnerableDependencies(int vulnerableDependencies) {
        this.vulnerableDependencies = vulnerableDependencies;
    }
}
