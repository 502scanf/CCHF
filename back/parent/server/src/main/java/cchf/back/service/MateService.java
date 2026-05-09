package cchf.back.service;

import cchf.back.dto.MateDto;

import java.util.List;

public interface MateService {

    List<MateDto> getUsersByRoomId(String roomid);

    boolean addUserByRoomId(String roomid, MateDto mateDto);

    boolean deleteUserByRoomIdAndUserId(String roomid, String uid);

    String sendInviteTokens(String username, String roomid);

    String confirmInvite(String token);
}
