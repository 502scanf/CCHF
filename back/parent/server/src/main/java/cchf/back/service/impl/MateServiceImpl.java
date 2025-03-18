package cchf.back.service.impl;

import cchf.back.dto.MateDto;
import cchf.back.mapper.MateMapper;
import cchf.back.mapper.RoomMapper;
import cchf.back.service.MateService;
import cchf.back.vo.RoomBuildVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Description: TODO
 * @BelongsProject: CCHF
 * @BelongsPackage: cchf.back.service.impl
 * @Author: Aureliano
 * @Date: 2025/3/13 21:03
 */
@Service
@Slf4j
public class MateServiceImpl implements MateService {

    @Autowired
    private RoomMapper roomMapper;
    @Autowired
    private MateMapper mateMapper;

    @Override
    public List<MateDto> getUsersByRoomId(String roomid) {
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        log.info("查询房间是否存在");
        if(room == null)
            throw new RuntimeException("房间不存在");
        List<MateDto> mateList = mateMapper.getUsersByRoomId(roomid);
        return mateList;
    }

    public boolean addUserByRoomId(String roomid, MateDto mateDto){
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        log.info("查询房间是否存在");
        if(room == null)
            throw new RuntimeException("房间不存在");
        boolean result = mateMapper.addUserByRoomId(roomid,mateDto);
        return result;
    }

    public boolean deleteUserByRoomIdAndUserId(String roomid,String uid){
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        log.info("查询房间是否存在");
        if(room == null)
            throw new RuntimeException("房间不存在");
        boolean result = mateMapper.deleteUserByRoomIdAndUserId(roomid,uid);
        return result;
    }

}