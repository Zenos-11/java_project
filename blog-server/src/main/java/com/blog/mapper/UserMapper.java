package com.blog.mapper;

import com.blog.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {
    User findByUsername(@Param("username") String username);
    User findById(@Param("id") Integer id);
    List<User> findAll();
    int insert(User user);
    int updateStatus(@Param("id") Integer id, @Param("status") Integer status);
    int update(User user);
    int countByUsername(@Param("username") String username);
}
