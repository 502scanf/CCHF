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

    // 创建room
    @PostMapping("/work")
    public result<RoomBuildVo> roomBuild(@RequestBody RoomBuildDto roomBuildDto) {
        log.info("Room build");
        Room room = roomService.build(roomBuildDto);

        log.info("build done");
        RoomBuildVo roomBuildVo = RoomBuildVo.builder()
                .roomname(room.getRoomname())
                .time(room.getTime())
                .onerid(room.getOnerid())
                .roomid(room.getRoomid())
                .status(room.getStatus())
                .build();

        return result.success(roomBuildVo);
    }

    // id查询room
    @GetMapping("/{roomname}")
    public result<RoomBuildVo> getRoom(@PathVariable String roomname) {
        log.info("getRoom...");
        RoomBuildVo roomBuildVo = roomService.getRoom(roomname);

        return result.success(roomBuildVo);
    }

    // 查询room列表
    @GetMapping("/roomlist")
    public result<List<RoomBuildVo>> getRoomList() {
        log.info("finding...");
        List<RoomBuildVo> roomList = roomService.getRoomList(BaseContext.getCurrentId());
        return result.success(roomList);
    }

    // 分页查询room列表
    @GetMapping("/roomlist/page")
    public result<cchf.back.vo.PageResultVo<RoomBuildVo>> getRoomListPage(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("finding room list with pagination, page: {}, pageSize: {}", page, pageSize);
        cchf.back.vo.PageResultVo<RoomBuildVo> pageResult = roomService.getRoomListPage(BaseContext.getCurrentId(),
                page, pageSize);
        return result.success(pageResult);
    }

    // 回收已完成room
    @PostMapping("/recycle/{roomid}")
    public result<RoomRecycleVo> recycleRoom(@PathVariable String roomid) {

        log.info("recycle...");
        try {
            RoomRecycleVo roomRecycleVo = roomService.recycleRoom(roomid);
            return result.success(roomRecycleVo);
        } catch (Exception e) {
            log.info("回收失败", e.getMessage());
            throw new RecycleException(MessageConstant.RECYCLE_ERROR + ": " + e.getMessage());
        }
    }

    // 恢复回收站的room
    @PostMapping("/restore/{roomid}")
    public result<?> restoreRoom(@PathVariable String roomid) {
        log.info("restore...");
        roomService.restoreRoom(roomid);
        return result.success();
    }

    // 获取回收站room列表
    @GetMapping("/recycled")
    public result<List<RoomBuildVo>> getRecycledRooms() {
        log.info("finding recycled...");
        List<RoomBuildVo> roomList = roomService.getRecycledRooms(BaseContext.getCurrentId());
        return result.success(roomList);
    }

    // 分页查询回收站room列表
    @GetMapping("/recycled/page")
    public result<cchf.back.vo.PageResultVo<RoomBuildVo>> getRecycledRoomsPage(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("finding recycled rooms with pagination, page: {}, pageSize: {}", page, pageSize);
        cchf.back.vo.PageResultVo<RoomBuildVo> pageResult = roomService.getRecycledRoomsPage(BaseContext.getCurrentId(),
                page, pageSize);
        return result.success(pageResult);
    }

    // 获取我加入的所有房间
    @GetMapping("/relatedRooms")
    public result<List<RoomBuildVo>> getRelatedRooms() {
        log.info("finding related rooms...");
        List<RoomBuildVo> roomList = roomService.getRelatedRooms(BaseContext.getCurrentId());
        return result.success(roomList);
    }

    // 分页查询我加入的所有房间
    @GetMapping("/relatedRooms/page")
    public result<cchf.back.vo.PageResultVo<RoomBuildVo>> getRelatedRoomsPage(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("finding related rooms with pagination, page: {}, pageSize: {}", page, pageSize);
        cchf.back.vo.PageResultVo<RoomBuildVo> pageResult = roomService.getRelatedRoomsPage(BaseContext.getCurrentId(),
                page, pageSize);
        return result.success(pageResult);
    }

    // 永久删除房间
    @DeleteMapping("/delete/{roomid}")
    public result<?> deleteRoom(@PathVariable String roomid) {
        log.info("permanently deleting room...");
        roomService.deleteRoomPermanently(roomid);
        return result.success();
    }

    // 修改房间名称
    @PostMapping("/rename")
    public result<?> renameRoom(@RequestBody cchf.back.dto.RoomRenameDto roomRenameDto) {
        log.info("renaming room: {} to {}", roomRenameDto.getRoomid(), roomRenameDto.getNewName());
        roomService.renameRoom(roomRenameDto.getRoomid(), roomRenameDto.getNewName());
        return result.success();
    }
}
