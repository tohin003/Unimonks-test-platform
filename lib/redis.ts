import { Redis } from 'ioredis'

const redisClientSingleton = () => {
    return new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    })
}

type RedisClientSingleton = ReturnType<typeof redisClientSingleton>

const globalForRedis = globalThis as unknown as {
    redis: RedisClientSingleton | undefined
}

export const redis = globalForRedis.redis ?? redisClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis
