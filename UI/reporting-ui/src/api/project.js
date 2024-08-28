import request from '../utils/request'

export default {
    // test
    getProjectListWithPagination(pageNum, pageSize) {
        return request({
            url: `/api/getProjectListWithPagination/${pageNum}/${pageSize}`,
            method: 'get'
        })
    },
    getProjectListByProjectName(projectName) {
        return request({
            url: `/api/getProjectListByProjectName/${projectName}`,
            method: 'get'
        })
    },
    searchProjectByLevelAndProjectName(level, projectName) {
        return request({
            url: `/api/searchProjectByLevelAndProjectName/${level}/${projectName}`,
            method: 'get'
        })
    }
}