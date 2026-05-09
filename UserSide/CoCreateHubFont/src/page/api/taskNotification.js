import { cchRequest } from '../util/cchRequest'

/**
 * 获取房间任务通知列表
 */
export const getTaskNotificationListApi = (roomid) => {
    return cchRequest({
        url: `/task-notification/list/${roomid}`,
        method: 'get'
    })
}

/**
 * 获取房间未读通知数量
 */
export const getUnreadCountApi = (roomid) => {
    return cchRequest({
        url: `/task-notification/unread-count/${roomid}`,
        method: 'get'
    })
}

/**
 * 标记通知为已读
 */
export const markAsReadApi = (notificationid) => {
    return cchRequest({
        url: `/task-notification/mark-read/${notificationid}`,
        method: 'put'
    })
}

/**
 * 标记房间所有通知为已读
 */
export const markAllAsReadApi = (roomid) => {
    return cchRequest({
        url: `/task-notification/mark-all-read/${roomid}`,
        method: 'put'
    })
}