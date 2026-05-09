package cchf.back.mapper;

import cchf.back.dto.MateDto;
import cchf.back.entity.Mate;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MateMapper {
    /**
     * @description: 根据roomid获取用户列表
     * @author: Aureliano
     * @date: 2025/3/16 20:39
     * @param: roomid
     * @return: java.util.List<cchf.back.dto.mateDto>
     **/
    List<MateDto> getUsersByRoomId(String roomid);

    boolean addUserByRoomId(String roomid, MateDto mateDto);

    boolean deleteUserByRoomIdAndUserId(String roomid, String uid);

    Mate getUserIdByRoomIdAndUserId(String roomid, String userid);

    void addMateInfo(Mate mate);

    void deleteAllByRoomId(String roomid);
}
