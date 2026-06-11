package com.blog.service;

import com.blog.entity.Comment;

import java.util.List;

public interface CommentService {
    List<Comment> findByArticleId(Integer articleId);
    Comment create(Comment comment);
    void delete(Integer id, Integer userId, String role);
}
