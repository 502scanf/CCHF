package cchf.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocImportDto implements Serializable {
    private String docname;
    private String docroomid;
    private String content;  // 文件内容（HTML 或 Markdown）
    private String doctype;  // 文件类型
}
