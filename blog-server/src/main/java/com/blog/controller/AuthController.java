package com.blog.controller;

import com.blog.common.Result;
import com.blog.dto.LoginDto;
import com.blog.dto.RegisterDto;
import com.blog.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginDto loginDto) {
        Map<String, Object> result = userService.login(loginDto);
        return Result.success(result);
    }

    @PostMapping("/register")
    public Result<?> register(@RequestBody RegisterDto registerDto) {
        userService.register(registerDto);
        return Result.success();
    }
}
