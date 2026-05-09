package cchf.back.service.impl;

import cchf.back.entity.TaskNotification;
import cchf.back.mapper.TaskNotificationMapper;
import cchf.back.service.TaskNotificationService;
import cchf.back.vo.TaskNotificationVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 任务通知服务实现类
 */
@Slf4j
@Service
public class TaskNotificationServiceImpl implements TaskNotificationService {

    @Autowired
    private TaskNotificationMapper taskNotificationMapper;

    @Override
    public void createTaskNotification(String roomid, String taskid, String actionType, String taskContent,
            String operator) {
        log.info("创建任务通知: roomid={}, taskid={}, actionType={}, content={}", roomid, taskid, actionType, taskContent);

        TaskNotification notification = TaskNotification.builder()
                .notificationid(UUID.randomUUID().toString())
                .roomid(roomid)
                .taskid(taskid)
                .actionType(actionType)
                .taskContent(taskContent)
                .operator(operator)
                .createtime(new Timestamp(System.currentTimeMillis()))
                .isRead(0)
                .build();

        taskNotificationMapper.createNotification(notification);

        // 清理过期通知，保留最近100条
        taskNotificationMapper.deleteOldNotifications(roomid, 100);
    }

    @Override
    public List<TaskNotificationVo> getNotificationsByRoomId(String roomid) {
        log.info("获取房间任务通知列表: {}", roomid);

        List<TaskNotification> notifications = taskNotificationMapper.getNotificationsByRoomId(roomid);

        return notifications.stream()
                .map(this::convertToVo)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(String notificationid) {
        log.info("标记通知为已读: {}", notificationid);
        taskNotificationMapper.markAsRead(notificationid);
    }

    @Override
    public void markAllAsReadByRoomId(String roomid) {
        log.info("标记房间所有通知为已读: {}", roomid);
        taskNotificationMapper.markAllAsReadByRoomId(roomid);
    }

    @Override
    public int getUnreadCountByRoomId(String roomid) {
        return taskNotificationMapper.getUnreadCountByRoomId(roomid);
    }

    /**
     * 转换为VO
     */
    private TaskNotificationVo convertToVo(TaskNotification notification) {
        TaskNotificationVo vo = new TaskNotificationVo();
        BeanUtils.copyProperties(notification, vo);

        // 设置操作类型文本
        vo.setActionText(getActionText(notification.getActionType()));

        // 设置格式化时间
        SimpleDateFormat sdf = new SimpleDateFormat("MM-dd HH:mm");
        vo.setTimeText(sdf.format(notification.getCreatetime()));

        return vo;
    }

    /**
     * 获取操作类型文本
     */
    private String getActionText(String actionType) {
        switch (actionType) {
            case "CREATE":
                return "增加任务";
            case "UPDATE":
                return "编辑任务";
            case "DELETE":
                return "删除任务";
            default:
                return "任务变更";
        }
    }
}