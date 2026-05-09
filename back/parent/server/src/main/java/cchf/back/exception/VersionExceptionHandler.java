package cchf.back.exception;

import cchf.back.result.result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
@Slf4j
public class VersionExceptionHandler {

    @ExceptionHandler(VersionNotFoundException.class)
    @ResponseBody
    public result<Void> handleVersionNotFound(VersionNotFoundException e) {
        log.warn("版本不存在: {}", e.getMessage());
        return result.error("版本不存在或已被删除");
    }

    @ExceptionHandler(VersionLockedException.class)
    @ResponseBody
    public result<Void> handleVersionLocked(VersionLockedException e) {
        log.warn("版本已锁定: {}", e.getMessage());
        return result.error("版本已锁定，无法执行此操作");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseBody
    public result<Void> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("参数错误: {}", e.getMessage());
        return result.error("参数错误: " + e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseBody
    public result<Void> handleRuntimeException(RuntimeException e) {
        log.error("版本操作运行时错误", e);
        return result.error("操作失败，请稍后重试");
    }
}