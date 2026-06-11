package com.blog.service.impl;

import com.blog.common.BusinessException;
import com.blog.dto.LoginDto;
import com.blog.dto.RegisterDto;
import com.blog.entity.User;
import com.blog.mapper.UserMapper;
import com.blog.service.UserService;
import com.blog.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserServiceImpl(UserMapper userMapper, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Map<String, Object> login(LoginDto loginDto) {
        User user = userMapper.findByUsername(loginDto.getUsername());
        if (user == null) {
            throw new BusinessException("用户名或密码错误");
        }
        if (user.getStatus() == 0) {
            throw new BusinessException("账号已被禁用");
        }
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", user.getId());
        result.put("username", user.getUsername());
        result.put("nickname", user.getNickname());
        result.put("role", user.getRole());
        return result;
    }

    @Override
    public void register(RegisterDto registerDto) {
        if (registerDto.getUsername() == null || registerDto.getUsername().trim().isEmpty()) {
            throw new BusinessException("用户名不能为空");
        }
        if (registerDto.getPassword() == null || registerDto.getPassword().length() < 6) {
            throw new BusinessException("密码长度不能少于6位");
        }
        if (userMapper.countByUsername(registerDto.getUsername()) > 0) {
            throw new BusinessException("用户名已存在");
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setNickname(registerDto.getNickname() != null ? registerDto.getNickname() : registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setRole("user");
        userMapper.insert(user);
    }

    @Override
    public User getCurrentUser(Integer userId) {
        User user = userMapper.findById(userId);
        if (user != null) {
            user.setPassword(null);
        }
        return user;
    }

    @Override
    public List<User> listAll() {
        List<User> users = userMapper.findAll();
        for (User u : users) {
            u.setPassword(null);
        }
        return users;
    }

    @Override
    public void updateStatus(Integer id, Integer status) {
        userMapper.updateStatus(id, status);
    }
}
