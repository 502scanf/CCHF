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
export function editUserApi(editData){
    return cchRequest({
        url: '/user/edit',
        method:'post',
        data:editData
    })
}

export function deleteUserApi(deleteUserData){
    return cchRequest({
        url: '/user',
        method:'delete',
        data:deleteUserData
    })
}
