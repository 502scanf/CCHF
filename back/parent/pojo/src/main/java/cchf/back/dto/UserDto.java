package cchf.back.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 *@Description: 用户信息DTO
 *@BelongsProject: CCHF
 *@BelongsPackage: cchf.back.dto
 *@Author: Aureliano
 *@Date: 2025/3/25 18:13
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto implements Serializable {
    private String uid;
    private String uname;
    private String mail;
    private String password;
}