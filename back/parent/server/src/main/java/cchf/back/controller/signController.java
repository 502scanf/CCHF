package cchf.back.controller;

import cchf.back.dto.SignDto;
import cchf.back.result.result;
import cchf.back.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/cch")
public class signController {

    @Autowired
    private UserService userService;

    @PostMapping("/sign")
    public result sign(@RequestBody SignDto signDto){

        log.info(" 注册");
        userService.sign(signDto);
        log.info("done");
        return result.success();
    }
}
