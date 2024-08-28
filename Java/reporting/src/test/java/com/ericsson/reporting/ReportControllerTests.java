package com.ericsson.reporting;

import com.ericsson.reporting.model.vo.ReportProjectListReturnVo;
import com.ericsson.reporting.model.vo.ReportWithVulnerabilitiesReturnVo;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ReportControllerTests {
    @Autowired
    private TestRestTemplate template;

    private static long id;
    private static final String testProjectName = "testproject";

    @Test
    @Order(1)
    public void testGetAllReports() {
        ResponseEntity<List<Report>> response = template.exchange(
                "/api/all",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Report>>() {}
        );
        List<Report> responseBody = response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, responseBody.size());

        id = responseBody.get(0).getId();
    }
    @Test
    @Order(2)
    public void testGetReportById() {
        ResponseEntity<Report> response = template.getForEntity("/api/" + id, Report.class);
        Report responseBody = response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(id, responseBody.getId());
    }

    @Test
    public void test() {
        ResponseEntity<CustomPageImpl<ReportProjectListReturnVo>> response = template.exchange(
                "/api/getProjectListWithPagination/0/6",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Page<ReportProjectListReturnVo> responseBody = response.getBody();
        assertNotNull(responseBody);
        assertEquals(10, responseBody.getTotalElements());
    }

    @Test
    public void testGetProjectListByProjectName() {
        ResponseEntity<List<ReportWithVulnerabilitiesReturnVo>> response = template.exchange(
                "/api/getProjectListByProjectName/testproject",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        List<ReportWithVulnerabilitiesReturnVo> responseBody = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, responseBody.size());
        assertEquals(testProjectName, responseBody.get(0).getProjectName());
    }

    @Test
    public void testGetLastAnalyzedProject() {
        ResponseEntity<List<ReportWithVulnerabilitiesReturnVo>> response = template.exchange(
                "/api/getLastAnalyzedProject",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        List<ReportWithVulnerabilitiesReturnVo> responseBody = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, responseBody.size());
        assertEquals(testProjectName, responseBody.get(0).getProjectName());
    }

    @Test
    public void testSearchProjectByLevelAndProjectName() {
        ResponseEntity<List<ReportWithVulnerabilitiesReturnVo>> response = template.exchange(
                "/api/searchProjectByLevelAndProjectName/Medium/" + testProjectName,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        List<ReportWithVulnerabilitiesReturnVo> responseBody = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, responseBody.size());
        assertEquals(testProjectName, responseBody.get(0).getProjectName());
    }
}