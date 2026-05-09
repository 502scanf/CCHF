package cchf.back.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResultVo<T> implements Serializable {
    private Long total; // 总记录数
    private List<T> records; // 当前页数据
    private Integer page; // 当前页码
    private Integer pageSize; // 每页数量
    private Integer totalPages; // 总页数
}
