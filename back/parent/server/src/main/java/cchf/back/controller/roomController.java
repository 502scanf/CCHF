package cchf.back.controller;

import cchf.back.constant.BaseContext;
import cchf.back.constant.MessageConstant;
import cchf.back.dto.RoomBuildDto;
import cchf.back.entity.Room;
import cchf.back.exception.RecycleException;
import cchf.back.properties.JwtProperties;
import cchf.back.result.result;
import cchf.back.service.RoomService;
import cchf.back.util.jwtUtil;
import cchf.back.vo.RoomBuildVo;
import cchf.back.vo.RoomRecycleVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/cch/roomPlace")
public class roomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private JwtProperties jwtProperties;
    //创建room
    @PostMapping("/work")
    public result<RoomBuildVo> roomBuild(@RequestBody RoomBuildDto roomBuildDto){
        log.info("Room build");
        Room room = roomService.build(roomBuildDto);

        String token = jwtUtil.roomCreateJwt(
                room.getRoomname(),
                jwtProperties.getRoomSecretKey(),
                jwtProperties.getRoomTtl()
                );
        log.info("build done");
        RoomBuildVo roomBuildVo = RoomBuildVo.builder()
                .roomname(room.getRoomname())
                .time(room.getTime())
                .onerid(room.getOnerid())
                .roomid(room.getRoomid())
                .status(room.getStatus())
                .token(token)
                .build();

        return result.success(roomBuildVo);
    }

    //id查询room
    @GetMapping("/{roomname}")
    public result<RoomBuildVo> getRoom(@PathVariable String roomname){
        log.info("getRoom...");
        RoomBuildVo roomBuildVo = roomService.getRoom(roomname);

        return result.success(roomBuildVo);
    }

    //查询room列表
   @GetMapping("/roomlist")
    public result<List<RoomBuildVo>> getRoomList(){
        log.info("finding...");
        List<RoomBuildVo> roomList = roomService.getRoomList(BaseContext.getCurrentId());
        return result.success(roomList);
   }

   //回收已完成room
    @PostMapping("/recycle/{roomname}")
    public result<RoomRecycleVo> recycleRoom(@PathVariable String roomname){

        log.info("recycle...");
        try {
            RoomRecycleVo roomRecycleVo = roomService.recycleRoom(roomname);
            return result.success(roomRecycleVo);
        } catch (Exception e) {
            log.info("回收失败", e.getMessage());
            throw new RecycleException(MessageConstant.RECYCLE_ERROR+": "+e.getMessage());
        }
    }
    //通行证
    @PostMapping("/passRoom")
    public result<String> passRoom(@RequestBody RoomBuildDto roomBuildDto){

        roomService.passRoom(roomBuildDto);
        return result.success("pass successfully");
    }
}
