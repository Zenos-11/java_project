package com.blog.service;

import com.blog.common.PageResult;
import com.blog.dto.ArticleDto;
import com.blog.dto.ArticleQueryDto;
import com.blog.entity.Article;

import java.util.Map;

public interface ArticleService {
    PageResult<Article> findPage(ArticleQueryDto query);
    Map<String, Object> findById(Integer id);
    Article create(ArticleDto articleDto, Integer authorId);
    Article update(Integer id, ArticleDto articleDto, Integer userId, String role);
    void delete(Integer id, Integer userId, String role);
}
