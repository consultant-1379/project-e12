package com.ericsson.reporting;

import com.ericsson.reporting.model.vo.ReportProjectListReturnVo;
import com.ericsson.reporting.model.vo.ReportSearchReturnVo;

import com.ericsson.reporting.model.vo.ReportWithVulnerabilitiesReturnVo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ReportController {

    /*
    * Make sure to insert a "Medium" project names "testproject" for tests
    * */
    @Autowired
    private ReportRepository reportRepository;

    @GetMapping(path = "/all")
    public @ResponseBody Iterable<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable int id) {
        Optional<Report> optional = reportRepository.findById(id);
        return optional.map(report -> ResponseEntity.ok().body(report)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/getProjectListWithPagination/{pageNum}/{pageSize}")
    public ResponseEntity<Page<ReportProjectListReturnVo>> getProjectListWithPagination(@PathVariable int pageNum,
                                                               @PathVariable int pageSize) throws JsonProcessingException {
        // get all the project record
        List<Report> reportList = StreamSupport.stream(reportRepository.findAll().spliterator(), false)
                .toList();

        // group by the project_name
        Map<String, List<Report>> reportsByProjectName = reportList.stream()
                .collect(Collectors.groupingBy(Report::getProjectName));

        // count how much time the project has been analyzed
        Map<String, Long> projectCounts = reportList.stream()
                .collect(Collectors.groupingBy(Report::getProjectName, Collectors.counting()));

        // store the last analyzed project detail
        List<Report> latestReports = reportsByProjectName.values().stream()
                .map(reports -> reports.stream()
                        .max(Comparator.comparing(Report::getScanDate))
                        .orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // list to form the return result
        List<ReportProjectListReturnVo> integratedReports = new ArrayList<>();

        // form the return result
        for (Report latestReport : latestReports) {
            String projectName = latestReport.getProjectName();
            Date scanDate = latestReport.getScanDate();
            String vulnerabilities = latestReport.getVulnerabilities();

            ReportProjectListReturnVo integratedReport = new ReportProjectListReturnVo();
            integratedReport.setProjectName(projectName);
            integratedReport.setScanDate(scanDate);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(vulnerabilities);

            JsonNode dependenciesNode = jsonNode.path("dependencies");
            int numberOfElements = dependenciesNode.size();

            int count = 0;

            for(JsonNode dependencyNode : dependenciesNode) {
                if(dependencyNode.has("vulnerabilities")) {
                    count++;
                }
            }

            integratedReport.setVulnerableDependencies(count);
            integratedReport.setDependencyNum(numberOfElements);
            integratedReport.setVulnerabilities(jsonNode);
            integratedReport.setCount(projectCounts.get(projectName));

            integratedReports.add(integratedReport);
        }

        // form the pagination
        int totalElements = integratedReports.size();

        PageRequest pageRequest = PageRequest.of(pageNum, pageSize);

        List<ReportProjectListReturnVo> paginatedReports = integratedReports
                .stream()
                .skip((long) pageNum * pageSize)
                .limit(pageSize)
                .collect(Collectors.toList());

        Page<ReportProjectListReturnVo> paginatedPage = new PageImpl<>(paginatedReports, pageRequest, totalElements);

        return ResponseEntity.ok(paginatedPage);
    }

    @GetMapping("/getProjectListByProjectName/{projectName}")
    public ResponseEntity<List<ReportWithVulnerabilitiesReturnVo>> getProjectListByProjectName(@PathVariable String projectName) throws JsonProcessingException {
        List<Report> reports = reportRepository.findByProjectName(projectName);

        ObjectMapper objectMapper = new ObjectMapper();
        List<ReportWithVulnerabilitiesReturnVo> reportsWithVulnerabilities = new ArrayList<>();

        for(Report report : reports) {
            JsonNode vulnerabilitiesNode = objectMapper.readTree(report.getVulnerabilities());

            ReportWithVulnerabilitiesReturnVo reportWithVulnerabilities = new ReportWithVulnerabilitiesReturnVo();
            reportWithVulnerabilities.setProjectName(report.getProjectName());
            reportWithVulnerabilities.setScanDate(report.getScanDate());
            reportWithVulnerabilities.setVulnerabilities(vulnerabilitiesNode);

            reportsWithVulnerabilities.add(reportWithVulnerabilities);
        }

        reportsWithVulnerabilities.sort((r1, r2) -> r2.getScanDate().compareTo(r1.getScanDate()));

        return ResponseEntity.ok(reportsWithVulnerabilities);
    }

    @GetMapping("/getLastAnalyzedProject")
    public ResponseEntity<List<ReportWithVulnerabilitiesReturnVo>> getLastAnalyzedProject() throws JsonProcessingException {
        Iterable<Report> reports = reportRepository.findAll();

        List<Report> reportList = new ArrayList<>();
        reports.forEach(reportList::add);

        List<Report> sortedReports = reportList.stream()
                .sorted((r1, r2) -> r2.getScanDate().compareTo(r1.getScanDate()))
                .collect(Collectors.toList());

        Report lastAnalyzedReport = sortedReports.get(0);

        return getProjectListByProjectName(lastAnalyzedReport.getProjectName());
    }
    @GetMapping("/searchProjectByLevelAndProjectName/{level}/{projectName}")
    public ResponseEntity<List<ReportSearchReturnVo>> searchProjectByLevelAndProjectName(@PathVariable String level,
                                                                                         @PathVariable(required = false) String projectName) throws JsonProcessingException {
        List<Report> reportList = new ArrayList<>();

        // find all project with no project name
        if(projectName.equals("empty project search")) {
            Iterable<Report> reports = reportRepository.findAll();

            reports.forEach(reportList::add);
        }else {
            // find by specific project name
            reportList = reportRepository.findByProjectNameContainingIgnoreCase(projectName);
        }

        // list to form the return result
        List<ReportSearchReturnVo> reportSearchReturnVoList = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();

        for(Report report : reportList) {
            JsonNode jsonNode = objectMapper.readTree(report.getVulnerabilities());
            JsonNode dependenciesNode = jsonNode.path("dependencies");

            int count = 0;

            for(JsonNode dependencyNode : dependenciesNode) {
                if(dependencyNode.has("vulnerabilities")) {
                    count++;
                }
            }

            ReportSearchReturnVo reportSearchReturnVo = new ReportSearchReturnVo();
            reportSearchReturnVo.setProjectName(report.getProjectName());
            reportSearchReturnVo.setScanDate(report.getScanDate());
            reportSearchReturnVo.setVulnerableDependencies(count);

            String projectLevel = (count == 0) ? "None" :
                    (count >= 1 && count <= 3) ? "Low" :
                            (count >= 4 && count <= 5) ? "Medium" :
                                    (count >= 6 && count <= 7) ? "High" :
                                            (count >= 8 && count <= 10) ? "Critical" :
                                                    "Unknown";

            reportSearchReturnVo.setLevel(projectLevel);
            reportSearchReturnVo.setVulnerabilities(jsonNode);

            reportSearchReturnVoList.add(reportSearchReturnVo);
        }


        List<ReportSearchReturnVo> filteredList = reportSearchReturnVoList.stream()
                .filter(report -> level.equals(report.getLevel()))
                .collect(Collectors.toList());

        return "All".equals(level)? ResponseEntity.ok(reportSearchReturnVoList): ResponseEntity.ok(filteredList);
    }
}


