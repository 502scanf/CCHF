package cchf.back.service;

import cchf.back.dto.LoginDto;
import cchf.back.dto.SignDto;
import cchf.back.entity.User;

public interface UserService {
    User login(LoginDto loginDto);

    void sign(SignDto signDto);
}
