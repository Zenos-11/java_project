package com.blog.service;

import com.blog.dto.LoginDto;
import com.blog.dto.RegisterDto;
import com.blog.entity.User;

import java.util.List;
import java.util.Map;

public interface UserService {
    Map<String, Object> login(LoginDto loginDto);
    void register(RegisterDto registerDto);
    User getCurrentUser(Integer userId);
    List<User> listAll();
    void updateStatus(Integer id, Integer status);
}
