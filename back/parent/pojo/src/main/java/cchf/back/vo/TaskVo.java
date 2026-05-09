package cchf.back.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskVo {
    private String taskid;
    private String roomid;
    private String content;
    private String creator;
    private Timestamp createtime;
    private Timestamp updatetime;
}
