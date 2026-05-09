package cchf.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestoreVersionDto {
    private String docid;
    private String vid;
    private String reason;
}