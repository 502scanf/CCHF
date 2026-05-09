import { cchRequest } from "@page/util/cchRequest.js";

export function sendInviteTokensApi(username, roomid) {
    return cchRequest({
        url: `/mate/invite/${roomid}/${username}`,
        method: 'get',
        data: {
            roomid,
            username
        }
    })
}

export function confirmInviteApi(confirmInviteData) {
    return cchRequest({
        url: `/mate/invite/${confirmInviteData}`,
        method: 'get',
        data: confirmInviteData
    })
}