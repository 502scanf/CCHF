package cchf.back.service;

import cchf.back.vo.TaskNotificationVo;

import java.util.List;

/**
 * 任务通知服务接口
 */
public interface TaskNotificationService {

    /**
     * 创建任务变更通知
     */
    void createTaskNotification(String roomid, String taskid, String actionType, String taskContent, String operator);

    /**
     * 获取房间的任务通知列表
     */
    List<TaskNotificationVo> getNotificationsByRoomId(String roomid);

    /**
     * 标记通知为已读
     */
    void markAsRead(String notificationid);

    /**
     * 标记房间所有通知为已读
     */
    void markAllAsReadByRoomId(String roomid);

    /**
     * 获取房间未读通知数量
     */
    int getUnreadCountByRoomId(String roomid);
}