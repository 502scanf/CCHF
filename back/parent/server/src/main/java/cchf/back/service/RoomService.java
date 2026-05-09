package cchf.back.service;

import cchf.back.dto.RoomBuildDto;
import cchf.back.entity.Room;
import cchf.back.vo.PageResultVo;
import cchf.back.vo.RoomBuildVo;
import cchf.back.vo.RoomRecycleVo;

import java.util.List;

public interface RoomService {

    Room build(RoomBuildDto roomBuildDto);

    RoomBuildVo getRoom(String roomname);

    List<RoomBuildVo> getRoomList(String onerid);

    PageResultVo<RoomBuildVo> getRoomListPage(String onerid, Integer page, Integer pageSize);

    RoomRecycleVo recycleRoom(String roomid);

    void restoreRoom(String roomid);

    List<RoomBuildVo> getRecycledRooms(String onerid);

    PageResultVo<RoomBuildVo> getRecycledRoomsPage(String onerid, Integer page, Integer pageSize);

    void deleteRoomPermanently(String roomid);

    List<RoomBuildVo> getRelatedRooms(String memberid);

    PageResultVo<RoomBuildVo> getRelatedRoomsPage(String memberid, Integer page, Integer pageSize);

    void renameRoom(String roomid, String newName);
}
