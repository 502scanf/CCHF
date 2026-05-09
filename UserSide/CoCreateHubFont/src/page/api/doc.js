import { cchRequest } from "@page/util/cchRequest.js";

export function docBuildApi(docBuildData) {
    return cchRequest({
        url: '/docplace/build',
        method: 'post',
        data: docBuildData
    })
}

export function docRecycleApi(docRecycleData) {
    return cchRequest({
        url: '/docplace/recycle',
        method: 'post',
        data: docRecycleData
    })
}

// 保存文档内容（Base64 编码的 Yjs 状态）
export function saveContentApi(docid, content, editorId) {
    return cchRequest({
        url: '/docplace/saveContent',
        method: 'post',
        data: { docid, content, editorId }
    })
}

// 获取文档内容（返回 Base64 字符串）
export function getContentApi(docid) {
    return cchRequest({
        url: `/docplace/contentFind/${docid}`,
        method: 'get'
    })
}

export function docFindApi(docFindData) {
    return cchRequest({
        url: '/docplace/doc',
        method: 'get',
        data: docFindData
    })
}

export function docListApi(docListData) {
    return cchRequest({
        url: `/docplace/docList/${docListData}`,
        method: 'get'
    })
}

export function docListPageApi(roomid, page, pageSize) {
    return cchRequest({
        url: `/docplace/docList/${roomid}/page`,
        method: 'get',
        params: { page, pageSize }
    })
}

// 导入文档
export function docImportApi(docImportData) {
    return cchRequest({
        url: '/docplace/import',
        method: 'post',
        data: docImportData
    })
}

// 重命名文档
export function docRenameApi(docid, newName) {
    return cchRequest({
        url: '/docplace/rename',
        method: 'post',
        data: { docid, newName }
    })
}

// 删除文档
export function docDeleteApi(docid) {
    return cchRequest({
        url: `/docplace/delete/${docid}`,
        method: 'post'
    })
}
