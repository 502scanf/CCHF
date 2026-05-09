package cchf.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateLabelDto {
    private String action; // "add", "update", "delete"
    private String label;
    private Integer labelIndex; // for update/delete
}