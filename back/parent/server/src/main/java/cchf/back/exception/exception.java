package cchf.back.exception;

import cchf.back.constant.MessageConstant;
import cchf.back.result.result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;

@RestControllerAdvice
@Slf4j
public class exception {

    @ExceptionHandler
    public result ex(BaseException exception){
        log.error("异常信息：{}", exception.getMessage());
        return result.error(exception.getMessage());
    }
    @ExceptionHandler
    public result exceptionHandler(SQLIntegrityConstraintViolationException ex){
        String exMessage = ex.getMessage();
        if (exMessage.contains("Duplicate entry")) {
            String msg = exMessage.split(" ")[2] + MessageConstant.ACCOUNT_EXISTS;
            return result.error(msg);
        }
        return result.error(MessageConstant.UNKNOWN_ERROR);
    }
}
