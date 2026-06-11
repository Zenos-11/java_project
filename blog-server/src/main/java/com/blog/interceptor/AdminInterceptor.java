package com.blog.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        // 放行 GET 请求（JwtInterceptor 已校验登录即可）
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String role = (String) request.getAttribute("role");
        if (!"admin".equals(role)) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":403,\"message\":\"需要管理员权限\"}");
            return false;
        }
        return true;
    }
}
