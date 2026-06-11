package com.blog.config;

import com.blog.interceptor.AdminInterceptor;
import com.blog.interceptor.JwtInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final JwtInterceptor jwtInterceptor;
    private final AdminInterceptor adminInterceptor;

    public WebConfig(JwtInterceptor jwtInterceptor, AdminInterceptor adminInterceptor) {
        this.jwtInterceptor = jwtInterceptor;
        this.adminInterceptor = adminInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/auth/login",
                        "/api/auth/register",
                        "/api/articles",          // GET 公开
                        "/api/articles/*/comments", // GET 公开
                        "/api/categories"         // GET 公开
                );

        registry.addInterceptor(adminInterceptor)
                .addPathPatterns(
                        "/api/categories/**",  // POST/PUT/DELETE
                        "/api/users"           // GET 用户列表
                )
                .excludePathPatterns(
                        "/api/categories"      // GET 公开
                );
    }
}
