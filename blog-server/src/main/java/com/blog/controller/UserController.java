package com.blog.controller;

import com.blog.common.Result;
import com.blog.entity.User;
import com.blog.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public Result<User> currentUser(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        return Result.success(userService.getCurrentUser(userId));
    }

    @GetMapping
    public Result<List<User>> list() {
        return Result.success(userService.listAll());
    }

    @PutMapping("/{id}")
    public Result<?> updateStatus(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
        userService.updateStatus(id, body.get("status"));
        return Result.success();
    }
}
