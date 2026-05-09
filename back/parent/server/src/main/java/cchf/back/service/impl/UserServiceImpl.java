package cchf.back.service.impl;

import cchf.back.constant.BaseContext;
import cchf.back.constant.MessageConstant;
import cchf.back.dto.LoginDto;
import cchf.back.dto.SignDto;
import cchf.back.dto.UserDto;
import cchf.back.entity.User;
import cchf.back.exception.AccountNotFoundException;
import cchf.back.exception.CodeNotFoundException;
import cchf.back.exception.PasswordErrorException;
import cchf.back.mapper.UserMapper;
import cchf.back.result.result;
import cchf.back.service.EmailService;
import cchf.back.service.UserService;
import cchf.back.util.simpleEmailJudge;
import cchf.back.util.uIdCreate;
import cn.hutool.core.util.RandomUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private EmailService emailService;

    @Override
    public User login(LoginDto loginDto) {

        String login = loginDto.getLogin();

        if (simpleEmailJudge.isEmail(login)) {
            User user = userMapper.getByMail(login);

            if (user == null)
                throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);

            if (!loginDto.getPassword().equals(user.getPassword()))
                throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
            return user;
        }
        User user = userMapper.getByName(login);
        if (user == null)
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        if (!loginDto.getPassword().equals(user.getPassword()))
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        return user;
    }

    @Override
    public void sign(SignDto signDto) {
        // 验证码校验
        String code = signDto.getCode();
        String cacheCode = stringRedisTemplate.opsForValue().get(signDto.getMail());

        if (cacheCode == null || !code.equals(cacheCode)) {
            throw new CodeNotFoundException(MessageConstant.CODE_NOT_FOUND);
        }

        // 简单id生成
        String uid = uIdCreate.generateId();
        User user = User.builder()
                .uid(uid)
                .logo("sljdfaksjfklsf")
                .uname(signDto.getUname())
                .mail(signDto.getMail())
                .password(signDto.getPassword())
                .build();

        userMapper.insert(user);

        // 注册成功后删除验证码
        stringRedisTemplate.delete(signDto.getMail());
        log.info("用户注册成功，邮箱: {}", signDto.getMail());
    }

    public result updateUserInfo(UserDto userDto, String uid) {
        userDto.setUid(uid);
        int res = userMapper.updateUserInfo(userDto);
        if (res <= 0)
            return result.error(MessageConstant.User_INFO_ERROR);
        return result.success(userDto);
    }

    public result deleteUserInfo(String uid) {
        int res = userMapper.deleteUserInfo(uid);
        if (res <= 0)
            return result.error(MessageConstant.User_DELETE_ERROR);
        return result.success();
    }

    @Override
    public result sendCode(String emailNumber, HttpSession httpSession) {
        // 验证邮箱格式
        if (!simpleEmailJudge.isEmail(emailNumber)) {
            return result.error("邮箱格式错误");
        }

        // 检查邮箱是否已注册
        User existUser = userMapper.getByMail(emailNumber);
        if (existUser != null) {
            return result.error("该邮箱已被注册");
        }

        // 生成4位验证码
        String code = RandomUtil.randomNumbers(4);

        // 发送邮件
        try {
            emailService.sendVerificationCode(emailNumber, code);
        } catch (Exception e) {
            log.error("发送验证码失败: {}", e.getMessage());
            return result.error("验证码发送失败，请稍后重试");
        }

        // 保存到Redis（5分钟过期）
        stringRedisTemplate.opsForValue().set(emailNumber, code, 5, TimeUnit.MINUTES);
        log.info("验证码已发送到邮箱: {}", emailNumber);

        return result.success("验证码已发送到您的邮箱");
    }

    @Override
    public String getName() {
        String uid = BaseContext.getCurrentId();
        String name = userMapper.getMemberName(uid);
        return name;
    }
}
