package cchf.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageQueryDto implements Serializable {
    private Integer page = 1; // 当前页码，默认第1页
    private Integer pageSize = 10; // 每页数量，默认10条
}
