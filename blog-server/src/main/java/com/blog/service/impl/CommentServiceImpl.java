package com.blog.service.impl;

import com.blog.common.BusinessException;
import com.blog.entity.Comment;
import com.blog.mapper.CommentMapper;
import com.blog.service.CommentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;

    public CommentServiceImpl(CommentMapper commentMapper) {
        this.commentMapper = commentMapper;
    }

    @Override
    public List<Comment> findByArticleId(Integer articleId) {
        return commentMapper.findByArticleId(articleId);
    }

    @Override
    public Comment create(Comment comment) {
        commentMapper.insert(comment);
        return commentMapper.findById(comment.getId());
    }

    @Override
    public void delete(Integer id, Integer userId, String role) {
        Comment comment = commentMapper.findById(id);
        if (comment == null) {
            throw new BusinessException(404, "评论不存在");
        }
        if (!"admin".equals(role) && !comment.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权删除他人评论");
        }
        commentMapper.deleteById(id);
    }
}
