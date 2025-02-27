package cchf.back.mapper;

import cchf.back.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    User getByMail(String login);
    User getByName(String login);

    void insert(User user);
}
