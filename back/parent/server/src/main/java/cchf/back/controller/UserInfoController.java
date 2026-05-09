package cchf.back.controller;

import cchf.back.constant.BaseContext;
import cchf.back.constant.JwtClaimsConstant;
import cchf.back.constant.MessageConstant;
import cchf.back.dto.UserDto;
import cchf.back.properties.JwtProperties;
import cchf.back.result.result;
import cchf.back.service.UserService;
import cchf.back.util.jwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * @Description: 用户信息系统
 * @BelongsProject: CCHF
 * @BelongsPackage: cchf.back.controller
 * @Author: Aureliano
 * @Date: 2025/3/25 18:25
 */
@Slf4j
@RestController
@RequestMapping("/cch/user")
public class UserInfoController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtProperties jwtProperties;

    @PostMapping("/edit")
    public result updateUserInfo(@RequestBody UserDto userDto) {
        if (userDto == null)
            return result.error(MessageConstant.UNKNOWN_ERROR);
        String uid = BaseContext.getCurrentId();
        result result = userService.updateUserInfo(userDto, uid);
        return result;
    }

    @DeleteMapping()
    public result deleteUserInfo() {
        String uid = BaseContext.getCurrentId();
        return userService.deleteUserInfo(uid);
    }

    @GetMapping("/name")
    public result<String> getName() {
        return result.success(userService.getName());
    }
}