package cchf.back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomTask {
    private String taskid; // 任务ID
    private String roomid; // 房间ID
    private String content; // 任务内容
    private String creator; // 创建者
    private Timestamp createtime; // 创建时间
    private Timestamp updatetime; // 更新时间
}
