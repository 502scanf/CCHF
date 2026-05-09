package cchf.back.controller;

import cchf.back.dto.SignDto;
import cchf.back.result.result;
import cchf.back.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/cch")
public class signController {

    @Autowired
    private UserService userService;

    @PostMapping("/code")
    public result sendCode(@RequestParam("email") String emailNumber, HttpSession httpSession) {
        log.info("发送验证码请求，邮箱: {}", emailNumber);
        return userService.sendCode(emailNumber, httpSession);
    }

    @PostMapping("/sign")
    public result sign(@RequestBody SignDto signDto) {

        log.info(" 注册");
        userService.sign(signDto);
        log.info("done");
        return result.success("用户创建成功");
    }
}
