import {cchRequest} from "@page/util/cchRequest.js";

export function docBuildApi(docBuildData){
    return cchRequest({
        url:'/docplace/build',
        method:'post',
        data:docBuildData
    })
}

export function docRecycleApi(docRecycleData){
    return cchRequest({
        url:'/docplace/recycle',
        method:'post',
        data:docRecycleData
    })
}

export function docFindApi(docFindData){
    return cchRequest({
        url: '/docplace/doc',
        method:'get',
        data: docFindData
    })
}

export function docListApi(docListData){
    return cchRequest({
        url: `/docplace/docList/${docListData}`,
        method:'get'
    })
}
