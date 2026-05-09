package cchf.back.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * 任务变更通知VO类
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskNotificationVo {

    /**
     * 通知ID
     */
    private String notificationid;

    /**
     * 房间ID
     */
    private String roomid;

    /**
     * 任务ID
     */
    private String taskid;

    /**
     * 操作类型：CREATE, UPDATE, DELETE
     */
    private String actionType;

    /**
     * 任务内容
     */
    private String taskContent;

    /**
     * 操作者ID
     */
    private String operator;

    /**
     * 创建时间
     */
    private Timestamp createtime;

    /**
     * 是否已读
     */
    private Integer isRead;

    /**
     * 格式化的操作类型文本
     */
    private String actionText;

    /**
     * 格式化的时间文本
     */
    private String timeText;
}