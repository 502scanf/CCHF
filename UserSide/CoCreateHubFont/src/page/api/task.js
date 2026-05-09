import { cchRequest } from "@page/util/cchRequest.js";

// 创建任务
export const createTaskApi = (data) => {
    return cchRequest({
        url: '/task/create',
        method: 'post',
        data
    })
}

// 获取房间任务列表
export const getTaskListApi = (roomid) => {
    return cchRequest({
        url: `/task/list/${roomid}`,
        method: 'get'
    })
}

// 更新任务
export const updateTaskApi = (data) => {
    return cchRequest({
        url: '/task/update',
        method: 'put',
        data
    })
}

// 删除任务
export const deleteTaskApi = (taskid) => {
    return cchRequest({
        url: `/task/delete/${taskid}`,
        method: 'delete'
    })
}
