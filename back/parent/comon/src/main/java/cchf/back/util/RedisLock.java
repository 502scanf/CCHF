package cchf.back.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.concurrent.TimeUnit;


public class RedisLock implements ILock{

    private String name;
    private StringRedisTemplate srt;

    public RedisLock(String name, StringRedisTemplate srt){
        this.name = name;
        this.srt = srt;
    }
    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT;
    static{
        UNLOCK_SCRIPT = new DefaultRedisScript<>();
        UNLOCK_SCRIPT.setLocation(new ClassPathResource("unlock.lua"));
        UNLOCK_SCRIPT.setResultType(Long.class);
    }
    @Override
    public boolean tryLock(long timeoutSec) {

        long thread = Thread.currentThread().getId();
        boolean judge =  srt.opsForValue().setIfAbsent(name, String.valueOf(thread), timeoutSec, TimeUnit.SECONDS);

        return Boolean.TRUE.equals(judge);
    }

    @Override
    public void unlock() {
        srt.execute(
                UNLOCK_SCRIPT,
                Collections.singletonList(name),
                String.valueOf(Thread.currentThread().getId())
                );
    }
}
