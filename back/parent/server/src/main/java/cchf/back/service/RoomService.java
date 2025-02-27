package cchf.back.service;

import cchf.back.dto.RoomBuildDto;
import cchf.back.vo.RoomBuildVo;
import cchf.back.vo.RoomRecycleVo;

import java.util.List;

public interface RoomService {

    RoomBuildVo build(RoomBuildDto roomBuildDto);
    RoomBuildVo getRoom(String roomname);

    List<RoomBuildVo> getRoomList(String onerid);

    RoomRecycleVo recycleRoom(String roomname);
}
