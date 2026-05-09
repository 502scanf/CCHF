import { cchRequest } from "@page/util/cchRequest.js";
import { docRecycleApi } from "@page/api/doc.js";

export function roomBuildApi(roomBuildData) {
    return cchRequest({
        url: '/roomPlace/work',
        method: 'post',
        data: roomBuildData
    }
    )
}

export function roomFindApi(roomFindData) {
    return cchRequest({
        url: `/roomPlace/${roomFindData}`,
        method: 'get',
        data: roomFindData
    }
    )
}

export function roomListApi(roomListData) {
    return cchRequest({
        url: '/roomPlace/roomlist',
        method: 'get',
        data: roomListData
    }
    )
}

export function roomListPageApi(page, pageSize) {
    return cchRequest({
        url: '/roomPlace/roomlist/page',
        method: 'get',
        params: { page, pageSize }
    })
}

export function roomRecycleApi(roomRecycleData) {
    return cchRequest({
        url: `/roomPlace/recycle/${roomRecycleData}`,
        method: 'post',
        data: roomRecycleData
    }
    )
}

export function passRoomApi(passRoomData) {
    return cchRequest({
        url: '/roomPlace/passRoom',
        method: 'post',
        data: passRoomData
    })
}

export function getRecycledRoomsApi() {
    return cchRequest({
        url: '/roomPlace/recycled',
        method: 'get'
    })
}

export function getRecycledRoomsPageApi(page, pageSize) {
    return cchRequest({
        url: '/roomPlace/recycled/page',
        method: 'get',
        params: { page, pageSize }
    })
}

export function restoreRoomApi(roomid) {
    return cchRequest({
        url: `/roomPlace/restore/${roomid}`,
        method: 'post'
    })
}

export function deleteRoomPermanentlyApi(roomid) {
    return cchRequest({
        url: `/roomPlace/delete/${roomid}`,
        method: 'delete'
    })
}

export function getRelatedRoomsApi() {
    return cchRequest({
        url: '/roomPlace/relatedRooms',
        method: 'get'
    })
}

export function getRelatedRoomsPageApi(page, pageSize) {
    return cchRequest({
        url: '/roomPlace/relatedRooms/page',
        method: 'get',
        params: { page, pageSize }
    })
}

export function renameRoomApi(roomRenameData) {
    return cchRequest({
        url: '/roomPlace/rename',
        method: 'post',
        data: roomRenameData
    })
}
