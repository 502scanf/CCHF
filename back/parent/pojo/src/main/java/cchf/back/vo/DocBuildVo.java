package cchf.back.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocBuildVo implements Serializable {
    private String docname;
    private String doctype;
    private int status;
    private Timestamp createtime;
    private String docid;
    private Timestamp updatetime;  // 更新时间
    private String updater;        // 更新人姓名
}
