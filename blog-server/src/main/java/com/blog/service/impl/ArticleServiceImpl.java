package com.blog.service.impl;

import com.blog.common.BusinessException;
import com.blog.common.PageResult;
import com.blog.dto.ArticleDto;
import com.blog.dto.ArticleQueryDto;
import com.blog.entity.Article;
import com.blog.entity.Tag;
import com.blog.mapper.ArticleMapper;
import com.blog.mapper.TagMapper;
import com.blog.service.ArticleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleMapper articleMapper;
    private final TagMapper tagMapper;

    public ArticleServiceImpl(ArticleMapper articleMapper, TagMapper tagMapper) {
        this.articleMapper = articleMapper;
        this.tagMapper = tagMapper;
    }

    @Override
    public PageResult<Article> findPage(ArticleQueryDto query) {
        long total = articleMapper.count(query);
        List<Article> list = articleMapper.findPage(query);
        for (Article article : list) {
            article.setContent(null);
        }
        return new PageResult<>(query.getPage(), query.getPageSize(), total, list);
    }

    @Override
    public Map<String, Object> findById(Integer id) {
        Article article = articleMapper.findById(id);
        if (article == null) {
            throw new BusinessException(404, "文章不存在");
        }
        articleMapper.incrementViewCount(id);
        List<String> tags = articleMapper.findTagsByArticleId(id);

        Map<String, Object> result = new HashMap<>();
        result.put("article", article);
        result.put("tags", tags);
        return result;
    }

    @Override
    @Transactional
    public Article create(ArticleDto dto, Integer authorId) {
        Article article = new Article();
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setSummary(dto.getSummary());
        article.setCategoryId(dto.getCategoryId());
        article.setAuthorId(authorId);
        article.setStatus(dto.getStatus() != null ? dto.getStatus() : "draft");
        articleMapper.insert(article);

        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            for (String tagName : dto.getTags()) {
                Tag tag = tagMapper.findByName(tagName.trim());
                if (tag == null) {
                    tag = new Tag();
                    tag.setName(tagName.trim());
                    tagMapper.insert(tag);
                }
                articleMapper.insertTag(article.getId(), tag.getId());
            }
        }
        return article;
    }

    @Override
    @Transactional
    public Article update(Integer id, ArticleDto dto, Integer userId, String role) {
        Article article = articleMapper.findById(id);
        if (article == null) {
            throw new BusinessException(404, "文章不存在");
        }
        if (!"admin".equals(role) && !article.getAuthorId().equals(userId)) {
            throw new BusinessException(403, "无权修改他人文章");
        }

        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setSummary(dto.getSummary());
        article.setCategoryId(dto.getCategoryId());
        article.setStatus(dto.getStatus());
        articleMapper.update(article);

        if (dto.getTags() != null) {
            articleMapper.deleteTagsByArticleId(id);
            for (String tagName : dto.getTags()) {
                Tag tag = tagMapper.findByName(tagName.trim());
                if (tag == null) {
                    tag = new Tag();
                    tag.setName(tagName.trim());
                    tagMapper.insert(tag);
                }
                articleMapper.insertTag(id, tag.getId());
            }
        }
        return articleMapper.findById(id);
    }

    @Override
    public void delete(Integer id, Integer userId, String role) {
        Article article = articleMapper.findById(id);
        if (article == null) {
            throw new BusinessException(404, "文章不存在");
        }
        if (!"admin".equals(role) && !article.getAuthorId().equals(userId)) {
            throw new BusinessException(403, "无权删除他人文章");
        }
        articleMapper.deleteById(id);
    }
}
