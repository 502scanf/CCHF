package cchf.back.service.impl;

import cchf.back.constant.BaseContext;
import cchf.back.constant.MessageConstant;
import cchf.back.dto.RoomBuildDto;
import cchf.back.entity.Room;
import cchf.back.exception.PasswordErrorException;
import cchf.back.exception.RoomExistException;
import cchf.back.mapper.RoomMapper;
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

   @Override
   public Room build(RoomBuildDto roomBuildDto){
       //房间唯一性
       log.info("only test");
       RoomBuildVo existRoom = roomMapper.getRoom(roomBuildDto.getRoomname());
       if (existRoom!= null)
           throw new RoomExistException(MessageConstant.ROOM_EXISTS);

       //房间建立
       log.info("build...");
       String roomid = uIdCreate.generateId();
       Room room = Room.builder()
               .roomname(roomBuildDto.getRoomname())
               .roomid(roomid)
               .status(0)
               .onerid(BaseContext.getCurrentId())
               .time(new Timestamp(System.currentTimeMillis()))
               .roompassword(roomBuildDto.getRoompassword())
               .build();

       roomMapper.insert(room);
       log.info("done");

       return room;
   }

    @Override
    public RoomBuildVo getRoom(String roomname) {

       RoomBuildVo roomBuildVo = roomMapper.getRoom(roomname);

       if(roomBuildVo == null){
           throw new RoomExistException(MessageConstant.ROOM_NO_EXISTS);
       }
        return roomBuildVo;
    }

    @Override
    public List<RoomBuildVo> getRoomList(String onerid) {

        List<RoomBuildVo> roomList = roomMapper.getRoomList(onerid);

        if (roomList.isEmpty()){
            throw new RoomExistException(MessageConstant.ROOM_NUMBER_NULL);
        }
        return roomList;
    }

    @Override
    public RoomRecycleVo recycleRoom(String roomname){
       roomMapper. recycleRoom(roomname);
        RoomRecycleVo roomRecycleVo = new RoomRecycleVo();
        roomRecycleVo.setRoomname(roomname);
        return roomRecycleVo;
    }

    @Override
    public void passRoom(RoomBuildDto roomBuildDto) {
      String password =  roomMapper.getRoomPassword(roomBuildDto.getRoomname());

      if (!roomBuildDto.getRoompassword().equals(password))
          throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
   }

}
