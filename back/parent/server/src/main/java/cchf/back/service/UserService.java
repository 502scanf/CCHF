package cchf.back.service;

import cchf.back.dto.LoginDto;
import cchf.back.dto.SignDto;
import cchf.back.dto.UserDto;
import cchf.back.entity.User;
import cchf.back.result.result;
import jakarta.servlet.http.HttpSession;

public interface UserService {
    User login(LoginDto loginDto);

    void sign(SignDto signDto);

    result updateUserInfo(UserDto userDto, String uid);

    result deleteUserInfo(String uid);

    result sendCode(String emailNumber, HttpSession httpSession);

    String getName();
}
