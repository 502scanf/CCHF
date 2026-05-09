package cchf.back.controller;

import cchf.back.constant.JwtClaimsConstant;
import cchf.back.dto.LoginDto;
import cchf.back.entity.User;
import cchf.back.properties.JwtProperties;
import cchf.back.result.result;
import cchf.back.service.UserService;
import cchf.back.util.jwtUtil;
import cchf.back.vo.LoginVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Time;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/cch")
public class loginController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtProperties jwtProperties;

    @PostMapping("/login")
    public result<LoginVo> login(@RequestBody LoginDto loginDto){

        log.info("登录");
        User user = userService.login(loginDto);
        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtClaimsConstant.user_id, user.getUid());

        String token = jwtUtil.createJwt(
                claims,
                jwtProperties.getUserSecretKey(),
                jwtProperties.getUserTtl()
        );

        log.info("userVo");
        LoginVo loginVo = LoginVo.builder()
                .uname(user.getUname())
                .mail(user.getMail())
                .logo(user.getLogo())
                .token(token)
                .loginTime(new Date().getTime())
                .build();

        return result.success(loginVo);
    }

    @PostMapping("/logout")
    public result logout(){
        return result.success();
    }
}
