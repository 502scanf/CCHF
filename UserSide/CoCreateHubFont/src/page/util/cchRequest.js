import axios from "axios";
import { getToken } from "@page/util/token.js";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = "/api"
const cchRequest = axios.create({
    baseURL: BASE_URL,
    timeout: 5000000,
})

cchRequest.interceptors.request.use((config) => {

    const token = getToken();
    const roomToken = localStorage.getItem('roomToken');
    if (token) {
        config.headers = {
            ...config.headers,
            'cch': `Bearer ${token}`
        }
    }
    if (roomToken) {
        config.headers = {
            ...config.headers,
            'room': `Bearer ${roomToken}`
        }
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

import { message } from "antd";

cchRequest.interceptors.response.use((response) => {
    const res = response.data

    // 后端返回 HTTP 200 但业务失败（code !== 1）
    if (res.code !== undefined && res.code !== 1) {
        message.error(res.msg || '操作失败')
        return Promise.reject(new Error(res.msg || '操作失败'))
    }

    return res
}, (error) => {
    // 处理HTTP错误（4xx, 5xx等）
    console.error('请求错误:', error)

    // 只在特定情况下显示错误消息
    if (error.response) {
        const status = error.response.status

        if (status === 401) {
            message.error('未授权，请重新登录')
        }
        // 其他错误不在这里显示，让调用方处理
    }

    return Promise.reject(error)
})

export { cchRequest }
