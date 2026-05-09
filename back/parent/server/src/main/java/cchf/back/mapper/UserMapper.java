package cchf.back.mapper;

import cchf.back.dto.UserDto;
import cchf.back.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    User getByMail(String login);

    User getByName(String login);

    void insert(User user);

    int updateUserInfo(UserDto userDto);

    int deleteUserInfo(String uid);

    String getMemberName(String userid);
}
