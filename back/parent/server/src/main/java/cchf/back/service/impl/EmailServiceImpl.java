package cchf.back.service.impl;

import cchf.back.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Override
    public void sendVerificationCode(String to, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject("CoCreateHub - 注册验证码");
            message.setText(String.format(
                    "欢迎注册 CoCreateHub！\n\n" +
                            "您的验证码是：%s\n\n" +
                            "验证码有效期为5分钟，请尽快完成注册。\n" +
                            "如果这不是您的操作，请忽略此邮件。\n\n" +
                            "CoCreateHub 团队",
                    code));

            mailSender.send(message);
            log.info("验证码邮件发送成功，收件人: {}", to);
        } catch (Exception e) {
            log.error("验证码邮件发送失败，收件人: {}, 错误: {}", to, e.getMessage());
            throw new RuntimeException("邮件发送失败，请稍后重试");
        }
    }
}
