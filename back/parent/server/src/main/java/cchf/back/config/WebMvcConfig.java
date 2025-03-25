package cchf.back.config;

import cchf.back.interceptor.JwtLoginInterceptor;
import cchf.back.interceptor.JwtRoomInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Slf4j
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    private JwtLoginInterceptor jwtLoginInterceptor;
    @Autowired
    private JwtRoomInterceptor jwtRoomInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
       log.info("注册自定义拦截器...");
       registry.addInterceptor(jwtLoginInterceptor)
               .addPathPatterns("/cch/**")
               .excludePathPatterns("/cch/login")
               .excludePathPatterns("/cch/sign");
       registry.addInterceptor(jwtRoomInterceptor)
               .addPathPatterns("/cch/roomPlace/insideRoom");

    }
}
