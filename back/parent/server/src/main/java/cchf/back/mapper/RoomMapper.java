package cchf.back.mapper;


import cchf.back.entity.Room;
import cchf.back.vo.RoomBuildVo;
import cchf.back.vo.RoomRecycleVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RoomMapper {
    void insert(Room room);

    RoomBuildVo getRoom(String roomname);

    RoomBuildVo getRoomByRoomId(String roomid);

    List<RoomBuildVo> getRoomList(String onerid);

    void recycleRoom(String roomname);

    String getRoomPassword(String roomname);
}
