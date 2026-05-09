package cchf.back.service.impl;

import cchf.back.constant.BaseContext;
import cchf.back.constant.JwtClaimsConstant;
import cchf.back.constant.MessageConstant;
import cchf.back.dto.MateDto;
import cchf.back.exception.MateException;
import cchf.back.exception.RoomExistException;
import cchf.back.mapper.MateMapper;
import cchf.back.mapper.RoomMapper;
import cchf.back.mapper.UserMapper;
import cchf.back.properties.JwtProperties;
import cchf.back.service.MateService;
import cchf.back.util.jwtUtil;
import cchf.back.vo.RoomBuildVo;
import cchf.back.entity.Mate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

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
    @Autowired
    private JwtProperties jwtProperties;
    @Autowired
    private UserMapper userMapper;

    @Override
    public List<MateDto> getUsersByRoomId(String roomid) {
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        log.info("查询房间是否存在");
        if (room == null)
            throw new RuntimeException("房间不存在");
        List<MateDto> mateList = mateMapper.getUsersByRoomId(roomid);
        return mateList;
    }

    public boolean addUserByRoomId(String roomid, MateDto mateDto) {
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        log.info("查询房间是否存在");
        if (room == null)
            throw new RuntimeException("房间不存在");
        boolean result = mateMapper.addUserByRoomId(roomid, mateDto);
        return result;
    }

    public boolean deleteUserByRoomIdAndUserId(String roomid, String uid) {
        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        log.info("查询房间是否存在");
        if (room == null)
            throw new RuntimeException("房间不存在");
        boolean result = mateMapper.deleteUserByRoomIdAndUserId(roomid, uid);
        return result;
    }

    public String sendInviteTokens(String username, String roomid) {

        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        if (room == null) {
            throw new RuntimeException("房间不存在");
        }

        String roomName = room.getRoomname() == null ? "" : room.getRoomname();

        Map<String, Object> claims = new java.util.HashMap<>();
        claims.put(JwtClaimsConstant.room_id, roomid);
        claims.put(JwtClaimsConstant.user_id, BaseContext.getCurrentId());
        claims.put("userName", username);
        claims.put("roomName", roomName);

        String inviteToken = jwtUtil.createJwt(
                claims,
                jwtProperties.getRoomSecretKey(),
                jwtProperties.getInviteTtl());

        // 返回包含token的url
        return "http://localhost:5173/invite?token=" + inviteToken;
    }

    @Override
    public String confirmInvite(String token) {

        Map<String, Object> claims;
        try {
            claims = jwtUtil.parseJwt(token, jwtProperties.getRoomSecretKey());
        } catch (Exception exc) {
            throw new MateException(MessageConstant.INVITE_TOKEN_ERROR);
        }

        String roomid = (String) claims.get(JwtClaimsConstant.room_id);

        RoomBuildVo room = roomMapper.getRoomByRoomId(roomid);
        if (room == null) {
            throw new RoomExistException("房间不存在或已经解散");
        }
        String userid = BaseContext.getCurrentId();
        Mate tempmate = mateMapper.getUserIdByRoomIdAndUserId(roomid, userid);
        if (tempmate == null) {

            String membername = userMapper.getMemberName(userid);

            Mate mate = Mate.builder()
                    .roomid(roomid)
                    .userid(userid)
                    .membername(membername)
                    .build();

            mateMapper.addMateInfo(mate);
        }
        return "success";
    }
}