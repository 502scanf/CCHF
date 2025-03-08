import {cchRequest} from "@page/util/cchRequest.js";

export function signApi (signData){
    return cchRequest({
        url: '/sign',
        method:'post',
        data:signData
    }
    )
}
export function loginApi (loginData){
    return cchRequest({
        url: '/login',
        method:'post',
        data: loginData
    })
}
