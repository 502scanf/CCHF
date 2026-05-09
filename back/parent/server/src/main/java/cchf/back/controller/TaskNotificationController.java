package cchf.back.controller;

import cchf.back.result.result;
import cchf.back.service.TaskNotificationService;
import cchf.back.vo.TaskNotificationVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 任务通知控制器
 */
@Slf4j
@RestController
@RequestMapping("/cch/task-notification")
public class TaskNotificationController {

    @Autowired
    private TaskNotificationService taskNotificationService;

    /**
     * 获取房间任务通知列表
     */
    @GetMapping("/list/{roomid}")
    public result<List<TaskNotificationVo>> getNotificationList(@PathVariable String roomid) {
        log.info("获取房间任务通知列表: {}", roomid);
        try {
            List<TaskNotificationVo> notifications = taskNotificationService.getNotificationsByRoomId(roomid);
            return result.success(notifications);
        } catch (Exception e) {
            log.error("获取任务通知列表失败", e);
            return result.error(e.getMessage());
        }
    }

    /**
     * 获取房间未读通知数量
     */
    @GetMapping("/unread-count/{roomid}")
    public result<Integer> getUnreadCount(@PathVariable String roomid) {
        log.info("获取房间未读通知数量: {}", roomid);
        try {
            int count = taskNotificationService.getUnreadCountByRoomId(roomid);
            return result.success(count);
        } catch (Exception e) {
            log.error("获取未读通知数量失败", e);
            return result.error(e.getMessage());
        }
    }

    /**
     * 标记通知为已读
     */
    @PutMapping("/mark-read/{notificationid}")
    public result<?> markAsRead(@PathVariable String notificationid) {
        log.info("标记通知为已读: {}", notificationid);
        try {
            taskNotificationService.markAsRead(notificationid);
            return result.success();
        } catch (Exception e) {
            log.error("标记通知为已读失败", e);
            return result.error(e.getMessage());
        }
    }

    /**
     * 标记房间所有通知为已读
     */
    @PutMapping("/mark-all-read/{roomid}")
    public result<?> markAllAsRead(@PathVariable String roomid) {
        log.info("标记房间所有通知为已读: {}", roomid);
        try {
            taskNotificationService.markAllAsReadByRoomId(roomid);
            return result.success();
        } catch (Exception e) {
            log.error("标记所有通知为已读失败", e);
            return result.error(e.getMessage());
        }
    }
}