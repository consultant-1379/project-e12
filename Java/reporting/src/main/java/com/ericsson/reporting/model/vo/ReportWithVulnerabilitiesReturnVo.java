package com.ericsson.reporting.model.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.Date;

public class ReportWithVulnerabilitiesReturnVo {
    private String projectName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date scanDate;

    private JsonNode vulnerabilities;

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

    public JsonNode getVulnerabilities() {
        return vulnerabilities;
    }

    public void setVulnerabilities(JsonNode vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }
}
