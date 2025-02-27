package cchf.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocBuildDto implements Serializable {
    private String docname;
    private String docroomid;
    private String doctype;
}
