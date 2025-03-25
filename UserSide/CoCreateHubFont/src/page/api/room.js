import {cchRequest} from "@page/util/cchRequest.js";
import {docRecycleApi} from "@page/api/doc.js";

export function roomBuildApi (roomBuildData){
    return cchRequest({
            url: '/roomPlace/work',
            method:'post',
            data:roomBuildData
        }
    )
}

export function roomFindApi (roomFindData){
    return cchRequest({
            url: '/roomPlace/${roomFindData}',
            method:'get',
            data:roomFindData
        }
    )
}

export function roomListApi (roomListData){
    return cchRequest({
            url: '/roomPlace/roomlist',
            method:'get',
            data:roomListData
        }
    )
}

export function roomRecycleApi (roomRecycleData){
    return cchRequest({
            url: '/roomPlace/recycle/${roomRecycleData}',
            method:'get',
            data:roomRecycleData
        }
    )
}

export function passRoomApi (passRoomData){
    return cchRequest({
            url: '/roomPlace/passRoom',
            method:'post',
            data:passRoomData
        }
    )
}

