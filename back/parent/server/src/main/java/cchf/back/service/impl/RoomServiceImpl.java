package cchf.back.service.impl;

import cchf.back.constant.BaseContext;
import cchf.back.constant.MessageConstant;
import cchf.back.dto.RoomBuildDto;
import cchf.back.entity.Mate;
import cchf.back.entity.Room;
import cchf.back.exception.RecycleException;
import cchf.back.exception.RoomExistException;
import cchf.back.mapper.DocMapper;
import cchf.back.mapper.DocVersionMapper;
import cchf.back.mapper.MateMapper;
import cchf.back.mapper.RoomMapper;
import cchf.back.mapper.UserMapper;
import cchf.back.service.RoomService;
import cchf.back.util.uIdCreate;
import cchf.back.vo.RoomBuildVo;
import cchf.back.vo.RoomRecycleVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@Slf4j
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomMapper roomMapper;
    @Autowired
    private MateMapper mateMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private DocMapper docMapper;
    @Autowired
    private DocVersionMapper docVersionMapper;

    @Override
    public Room build(RoomBuildDto roomBuildDto) {
        // 房间唯一性
        log.info("only test");
        RoomBuildVo existRoom = roomMapper.getRoom(roomBuildDto.getRoomname());
        if (existRoom != null)
            throw new RoomExistException(MessageConstant.ROOM_EXISTS);

        String userid = BaseContext.getCurrentId();
        String membername = userMapper.getMemberName(userid);
        // 房间建立
        log.info("build...");
        String roomid = uIdCreate.generateId();
        Room room = Room.builder()
                .roomname(roomBuildDto.getRoomname())
                .roomid(roomid)
                .status(0)
                .onerid(BaseContext.getCurrentId())
                .time(new Timestamp(System.currentTimeMillis()))
                .build();

        Mate mate = Mate.builder()
                .roomid(roomid)
                .userid(userid)
                .membername(membername)
                .build();
        roomMapper.insert(room);
        mateMapper.addMateInfo(mate);

        log.info("done");

        return room;
    }

    @Override
    public RoomBuildVo getRoom(String roomname) {

        RoomBuildVo roomBuildVo = roomMapper.getRoom(roomname);

        if (roomBuildVo == null) {
            throw new RoomExistException(MessageConstant.ROOM_NO_EXISTS);
        }
        return roomBuildVo;
    }

    @Override
    public List<RoomBuildVo> getRoomList(String onerid) {

        List<RoomBuildVo> roomList = roomMapper.getRoomList(onerid);

        return roomList;
    }

    @Override
    public RoomRecycleVo recycleRoom(String roomid) {
        String currentUserId = BaseContext.getCurrentId();
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        if (room == null) {
            throw new RoomExistException(MessageConstant.ROOM_NO_EXISTS);
        }
        if (!room.getOnerid().equals(currentUserId)) {
            throw new RecycleException("无权限回收房间");
        }
        roomMapper.recycleRoom(roomid);
        docMapper.recycleDocsByRoomId(roomid);

        RoomRecycleVo roomRecycleVo = new RoomRecycleVo();
        roomRecycleVo.setRoomname(room.getRoomname());
        return roomRecycleVo;
    }

    @Override
    public void restoreRoom(String roomid) {
        String currentUserId = BaseContext.getCurrentId();
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        if (room == null) {
            throw new RoomExistException(MessageConstant.ROOM_NO_EXISTS);
        }
        if (!room.getOnerid().equals(currentUserId)) {
            throw new RecycleException("无权限恢复房间");
        }
        roomMapper.restoreRoom(roomid);
        docMapper.restoreDocsByRoomId(roomid);
    }

    @Override
    public List<RoomBuildVo> getRecycledRooms(String onerid) {
        return roomMapper.getRecycledRooms(onerid);
    }

    @Override
    public void deleteRoomPermanently(String roomid) {
        String currentUserId = BaseContext.getCurrentId();
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        if (room == null) {
            throw new RoomExistException(MessageConstant.ROOM_NO_EXISTS);
        }
        if (!room.getOnerid().equals(currentUserId)) {
            throw new RecycleException("只有房主才能永久删除房间");
        }
        docVersionMapper.deleteVersionsByRoomId(roomid);
        docMapper.deleteDocsByRoomId(roomid);
        mateMapper.deleteAllByRoomId(roomid);
        roomMapper.deleteRoomPermanently(roomid);
    }

    @Override
    public List<RoomBuildVo> getRelatedRooms(String memberid) {
        return roomMapper.getRelatedRooms(memberid);
    }

    @Override
    public cchf.back.vo.PageResultVo<RoomBuildVo> getRoomListPage(String onerid, Integer page, Integer pageSize) {
        // 计算偏移量
        int offset = (page - 1) * pageSize;

        // 查询总数
        Long total = roomMapper.countRoomList(onerid);

        // 查询分页数据
        List<RoomBuildVo> records = roomMapper.getRoomListPage(onerid, offset, pageSize);

        // 计算总页数
        int totalPages = (int) Math.ceil((double) total / pageSize);

        return cchf.back.vo.PageResultVo.<RoomBuildVo>builder()
                .total(total)
                .records(records)
                .page(page)
                .pageSize(pageSize)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public cchf.back.vo.PageResultVo<RoomBuildVo> getRecycledRoomsPage(String onerid, Integer page, Integer pageSize) {
        int offset = (page - 1) * pageSize;
        Long total = roomMapper.countRecycledRooms(onerid);
        List<RoomBuildVo> records = roomMapper.getRecycledRoomsPage(onerid, offset, pageSize);
        int totalPages = (int) Math.ceil((double) total / pageSize);

        return cchf.back.vo.PageResultVo.<RoomBuildVo>builder()
                .total(total)
                .records(records)
                .page(page)
                .pageSize(pageSize)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public cchf.back.vo.PageResultVo<RoomBuildVo> getRelatedRoomsPage(String memberid, Integer page, Integer pageSize) {
        int offset = (page - 1) * pageSize;
        Long total = roomMapper.countRelatedRooms(memberid);
        List<RoomBuildVo> records = roomMapper.getRelatedRoomsPage(memberid, offset, pageSize);
        int totalPages = (int) Math.ceil((double) total / pageSize);

        return cchf.back.vo.PageResultVo.<RoomBuildVo>builder()
                .total(total)
                .records(records)
                .page(page)
                .pageSize(pageSize)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public void renameRoom(String roomid, String newName) {
        String currentUserId = BaseContext.getCurrentId();

        // 检查房间是否存在
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        if (room == null) {
            throw new RoomExistException(MessageConstant.ROOM_NO_EXISTS);
        }

        // 检查是否为房主
        if (!room.getOnerid().equals(currentUserId)) {
            throw new RecycleException("只有房主才能修改房间名称");
        }

        // 检查新名称是否已存在
        RoomBuildVo existingRoom = roomMapper.getRoom(newName);
        if (existingRoom != null && !existingRoom.getRoomid().equals(roomid)) {
            throw new RoomExistException("房间名称已存在");
        }

        // 执行重命名
        roomMapper.renameRoom(roomid, newName);
    }

}
