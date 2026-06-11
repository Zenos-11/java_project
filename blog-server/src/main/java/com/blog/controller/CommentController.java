package com.blog.controller;

import com.blog.common.Result;
import com.blog.entity.Comment;
import com.blog.service.CommentService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/articles/{articleId}/comments")
    public Result<List<Comment>> list(@PathVariable Integer articleId) {
        return Result.success(commentService.findByArticleId(articleId));
    }

    @PostMapping("/comments")
    public Result<Comment> create(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        Comment comment = new Comment();
        comment.setContent((String) body.get("content"));
        comment.setArticleId((Integer) body.get("articleId"));
        comment.setUserId(userId);
        return Result.success(commentService.create(comment));
    }

    @DeleteMapping("/comments/{id}")
    public Result<?> delete(@PathVariable Integer id, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        commentService.delete(id, userId, role);
        return Result.success();
    }
}
