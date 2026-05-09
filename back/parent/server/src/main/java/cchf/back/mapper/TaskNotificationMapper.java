package cchf.back.mapper;

import cchf.back.entity.TaskNotification;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 任务通知Mapper接口
 */
@Mapper
public interface TaskNotificationMapper {

    /**
     * 创建任务通知
     */
    void createNotification(TaskNotification notification);

    /**
     * 根据房间ID获取通知列表
     */
    List<TaskNotification> getNotificationsByRoomId(@Param("roomid") String roomid);

    /**
     * 标记通知为已读
     */
    void markAsRead(@Param("notificationid") String notificationid);

    /**
     * 标记房间所有通知为已读
     */
    void markAllAsReadByRoomId(@Param("roomid") String roomid);

    /**
     * 获取房间未读通知数量
     */
    int getUnreadCountByRoomId(@Param("roomid") String roomid);

    /**
     * 删除过期通知（保留最近100条）
     */
    void deleteOldNotifications(@Param("roomid") String roomid, @Param("keepCount") int keepCount);
}