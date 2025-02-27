package cchf.back.interceptor;

import cchf.back.constant.BaseContext;
import cchf.back.constant.JwtClaimsConstant;
import cchf.back.properties.JwtProperties;
import cchf.back.util.jwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtLoginInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtProperties jwtProperties;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //拦截controller
        if (!(handler instanceof HandlerMethod)) {

            return true;
        }
        log.info(String.valueOf(request));
        String token = request.getHeader(jwtProperties.getUserToken());
        try{

            log.info("校验:", token);
            Claims claims = jwtUtil.parseJwt(token, jwtProperties.getUserSecretKey());
            String uid = claims.get(JwtClaimsConstant.user_id).toString();
            log.info("uid", uid);
            BaseContext.setCurrentId(uid);
            //测试token过期自动刷新
            Date expiration = claims.getExpiration();
            long time = expiration.getTime()-System.currentTimeMillis();
            if (time>0 && time < 15 * 60 * 1000){

                Map<String, Object> temClaims = new HashMap<>();
                temClaims.put(JwtClaimsConstant.user_id, BaseContext.getCurrentId());
                String newToken = jwtUtil.createJwt(
                        temClaims,
                        jwtProperties.getUserSecretKey(),
                        jwtProperties.getUserTtl()
                );
                response.setHeader("Flash-Hoken", newToken);
            }
            return true;
        }catch (Exception ex) {
            //4、不通过，响应401状态码
            response.setStatus(401);
            return false;
        }
    }
}
