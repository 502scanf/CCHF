package cchf.back.controller;

import cchf.back.dto.MateDto;
import cchf.back.result.result;
import cchf.back.service.MateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Description:
 * @BelongsProject: CCHF
 * @BelongsPackage: cchf.back.controller
 * @Author: Aureliano
 * @Date: 2025/3/13 20:56
 */
@Slf4j
@RestController
@RequestMapping("/cch/mate")
public class mateController {

    @Autowired
    MateService mateService;

    @GetMapping("/lists/{roomid}")
    @ResponseBody
    List<MateDto> getRoomList(@PathVariable("roomid") String roomid) {
        log.info("查询房间用户列表:{}", roomid);
        if (roomid == null)
            throw new RuntimeException("roomid is null");
        return mateService.getUsersByRoomId(roomid);
    }

    @PostMapping("/add/{roomid}")
    boolean addMate(@PathVariable("roomid") String roomid, @RequestBody MateDto mateDto) {
        if (mateDto == null)
            throw new RuntimeException("mateDto is null");
        return mateService.addUserByRoomId(roomid, mateDto);
    }

    @DeleteMapping("/delete/{roomid}/{uid}")
    boolean deleteMate(@PathVariable String roomid, @PathVariable String uid) {
        if (uid == null)
            throw new RuntimeException("uid is null");
        return mateService.deleteUserByRoomIdAndUserId(roomid, uid);
    }

    // 发送邀请
    @GetMapping("/invite/{roomid}/{username}")
    public String sendInviteToken(@PathVariable String roomid, @PathVariable String username) {
        return mateService.sendInviteTokens(username, roomid);
    }

    // 确认邀请
    @GetMapping("/invite/{token}")
    public result<String> confirmInvite(@PathVariable String token) {

        return result.success(mateService.confirmInvite(token));
    }
}