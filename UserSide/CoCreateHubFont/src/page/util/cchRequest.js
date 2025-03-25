import axios from "axios";
import {getToken} from "@page/util/token.js";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = "/api"
const cchRequest = axios.create({
    baseURL: BASE_URL,
    timeout: 5000000,
})

cchRequest.interceptors.request.use((config)=>{

    const token = getToken();
    const roomToken = localStorage.getItem('roomToken');
    if(token){
        config.headers = {
            ...config.headers,
            'cch': `Bearer ${token}`
        }
    }
    if(roomToken){
        config.headers = {
            ...config.headers,
            'room': `Bearer ${roomToken}`
        }
    }
    console.log(BASE_URL)
    return config
},(error)=>{
    return Promise.reject(error)
})

cchRequest.interceptors.response.use((response)=>{
    return response.data
},(error)=>{
    return Promise.reject(error)
})

export {cchRequest}
