package cchf.back.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @Description: 用户列表中用户Dto
 * @BelongsProject: CCHF
 * @BelongsPackage: cchf.back.dto
 * @Author: Aureliano
 * @Date: 2025/3/13 20:58
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MateDto implements Serializable {
    private int id;
    private String uid;
    private String uname;
    private String logo;
}