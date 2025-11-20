package com.budgetTracker.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Configuration class to enable Spring's Caching Abstraction and configure
 * the Redis serialization strategy for best practice caching.
 */
@Configuration
@EnableCaching
public class CachingConfig {

    /**
     * Configures the default Redis cache behavior.
     * We use String serialization for keys and JSON (Jackson) serialization for values.
     * We also set a default Time-To-Live (TTL) for all cache entries.
     */
    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                // Set a default expiration time for cache entries (e.g., 60 minutes)
                .entryTtl(Duration.ofMinutes(60))
                // Do not cache null values (prevents cache poisoning)
                .disableCachingNullValues()
                // Use StringSerializer for keys (makes them readable in Redis CLI)
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                // Use GenericJackson2JsonRedisSerializer for values (serializes objects to JSON)
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
}