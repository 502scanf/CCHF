package cchf.back.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedissonConfig {

    @Bean
    public RedissonClient redissonClient(RedisProperties redisProperties) {
        Config config = new Config();

        // === 哨兵模式配置 (注释保留以备日后使用) ===
        // List<String> nodes = redisProperties.getSentinel().getNodes();
        // List<String> sentinelAddresses = new ArrayList<>();
        // for (String node: nodes){
        // sentinelAddresses.add("redis://" + node);
        // }
        // config.useSentinelServers()
        // .addSentinelAddress(sentinelAddresses.toArray(new String[0]))
        // // .setPassword(redisProperties.getPassword())
        // .setDatabase(redisProperties.getDatabase())
        // .setMasterName(redisProperties.getSentinel().getMaster());

        // === 单机模式配置 ===
        String redisAddress = "redis://" + redisProperties.getHost() + ":" + redisProperties.getPort();
        config.useSingleServer()
                .setAddress(redisAddress)
                .setDatabase(redisProperties.getDatabase());
        // .setPassword(redisProperties.getPassword());

        return Redisson.create(config);
    }
}
