package cchf.back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * 任务变更通知实体类
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskNotification {

    /**
     * 通知ID
     */
    private String notificationid;

    /**
     * 房间ID
     */
    private String roomid;

    /**
     * 任务ID（可为空，删除任务时任务ID已不存在）
     */
    private String taskid;

    /**
     * 操作类型：CREATE, UPDATE, DELETE
     */
    private String actionType;

    /**
     * 任务内容（用于显示）
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
     * 是否已读：0-未读，1-已读
     */
    private Integer isRead;
}