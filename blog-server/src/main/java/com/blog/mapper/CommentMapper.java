package com.blog.mapper;

import com.blog.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {
    List<Comment> findByArticleId(@Param("articleId") Integer articleId);
    int insert(Comment comment);
    int deleteById(@Param("id") Integer id);
    Comment findById(@Param("id") Integer id);
}
