package cchf.back.interceptor;

import cchf.back.constant.BaseContext;
import cchf.back.constant.JwtClaimsConstant;
import cchf.back.properties.JwtProperties;
import cchf.back.util.jwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class JwtRoomInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtProperties jwtProperties;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        log.info(String.valueOf(request));
        String Header  = request.getHeader(jwtProperties.getRoomToken());
        if (Header == null || !Header.startsWith("Bearer ")){
            response.sendError(HttpStatus.UNAUTHORIZED.value());
            return false;
        }
        String token = Header.substring(7);
        try{
            log.info("校验:", token);
            return true;
        }catch (Exception ex) {
            //4、不通过，响应401状态码
            response.setStatus(401);
            return false;
        }
    }
}
