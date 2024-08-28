package com.ericsson.reporting.model.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.Date;

public class ReportProjectListReturnVo {
    private String projectName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date scanDate;

    private JsonNode vulnerabilities;

    private Long count;

    private int dependencyNum;

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

    public JsonNode getVulnerabilities() {
        return vulnerabilities;
    }

    public void setVulnerabilities(JsonNode vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public int getDependencyNum() {
        return dependencyNum;
    }

    public void setDependencyNum(int dependencyNum) {
        this.dependencyNum = dependencyNum;
    }

    public int getVulnerableDependencies() {
        return vulnerableDependencies;
    }

    public void setVulnerableDependencies(int vulnerableDependencies) {
        this.vulnerableDependencies = vulnerableDependencies;
    }
}
