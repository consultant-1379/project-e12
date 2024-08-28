import axios from 'axios'
import {message} from 'antd'

const service = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 50000
})

service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        message.error('Network Error can not reach server')

        return Promise.reject(error)
    }
)

export default service