package cchf.back.mapper;

import cchf.back.entity.Room;
import cchf.back.vo.RoomBuildVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface RoomMapper {
        void insert(Room room);

        RoomBuildVo getRoom(String roomname);

        RoomBuildVo getRoomByRoomId(String roomid);

        List<RoomBuildVo> getRoomList(String onerid);

        Long countRoomList(@Param("onerid") String onerid);

        List<RoomBuildVo> getRoomListPage(@Param("onerid") String onerid, @Param("offset") Integer offset,
                        @Param("pageSize") Integer pageSize);

        void recycleRoom(String roomid);

        String getRoomPassword(String roomname);

        void restoreRoom(String roomid);

        List<RoomBuildVo> getRecycledRooms(String onerid);

        Long countRecycledRooms(@Param("onerid") String onerid);

        List<RoomBuildVo> getRecycledRoomsPage(@Param("onerid") String onerid, @Param("offset") Integer offset,
                        @Param("pageSize") Integer pageSize);

        List<Room> getExpiredRooms(LocalDateTime dateTime);

        void deleteRoomPermanently(String roomid);

        List<RoomBuildVo> getRelatedRooms(String memberid);

        Long countRelatedRooms(@Param("memberid") String memberid);

        List<RoomBuildVo> getRelatedRoomsPage(@Param("memberid") String memberid, @Param("offset") Integer offset,
                        @Param("pageSize") Integer pageSize);

        void renameRoom(@Param("roomid") String roomid, @Param("newName") String newName);
}
