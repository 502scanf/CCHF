package cchf.back.service.impl;

import cchf.back.constant.MessageConstant;
import cchf.back.dto.LoginDto;
import cchf.back.dto.SignDto;
import cchf.back.entity.User;
import cchf.back.exception.AccountNotFoundException;
import cchf.back.exception.PasswordErrorException;
import cchf.back.mapper.UserMapper;
import cchf.back.service.UserService;
import cchf.back.util.simpleEmailJudge;
import cchf.back.util.uIdCreate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;


    @Override
    public User login(LoginDto loginDto) {

        String login = loginDto.getLogin();

        if (simpleEmailJudge.isEmail(login)) {
            User user = userMapper.getByMail(login);

            if (user == null)
                throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);

            if(!loginDto.getPassword().equals(user.getPassword()))
                throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
            return user;
        }
        User user = userMapper.getByName(login);
        if (user == null)
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        if(!loginDto.getPassword().equals(user.getPassword()))
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        return user;
    }

    @Override
    public void sign(SignDto signDto) {

        //简单id生成
        String uid = uIdCreate.generateId();
        User user = User.builder()
                .uid(uid)
                .logo("sljdfaksjfklsf")
                .uname(signDto.getUname())
                .mail(signDto.getMail())
                .password(signDto.getPassword())
                .build();

        userMapper.insert(user);
    }
}
