package cchf.back.service;

import cchf.back.dto.RoomBuildDto;
import cchf.back.entity.Room;
import cchf.back.vo.RoomBuildVo;
import cchf.back.vo.RoomRecycleVo;

import java.util.List;

public interface RoomService {

    Room build(RoomBuildDto roomBuildDto);
    RoomBuildVo getRoom(String roomname);

    List<RoomBuildVo> getRoomList(String onerid);

    RoomRecycleVo recycleRoom(String roomname);

    void passRoom(RoomBuildDto roomBuildDto);
}
