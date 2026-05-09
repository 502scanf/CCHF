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
public class DefineDoc {
    private String docid;
    private String docname;
    private String doctype;
    private String docroomid;
    private int status;
    private byte[] content;
    private String owner;
    private Timestamp createtime;
    private Timestamp updatetime;

}
