// redis-connection-manager.ts
import { Redis } from 'ioredis';

class RedisConnectionManager {
    private static instance: RedisConnectionManager;
    private generalRedis: Redis | null = null;
    private bullmqRedis: Redis | null = null;
    private isShuttingDown = false;

    private constructor() { }

    public static getInstance(): RedisConnectionManager {
        if (!RedisConnectionManager.instance) {
            RedisConnectionManager.instance = new RedisConnectionManager();
        }
        return RedisConnectionManager.instance;
    }

    private createRedisConnection(name: string, config: any): Redis {
        const redis = new Redis(process.env.REDIS_URL as string, {
            connectTimeout: 60000,
            commandTimeout: 30000,
            maxRetriesPerRequest: config.maxRetriesPerRequest,
            enableReadyCheck: config.enableReadyCheck,
            lazyConnect: config.lazyConnect
        });

        // Setup event listeners
        redis.on('connect', () => {
            if (!this.isShuttingDown) {
                console.log(`${name} Redis connected`);
            }
        });

        redis.on('error', (error) => {
            if (!this.isShuttingDown) {
                console.error(`${name} Redis error:`, error.message);
            }
        });

        redis.on('close', () => {
            if (!this.isShuttingDown) {
                console.log(`${name} Redis connection closed`);
            }
        });

        redis.on('reconnecting', (ms: any) => {
            if (!this.isShuttingDown) {
                console.log(`${name} Redis reconnecting in ${ms}ms`);
            }
        });

        return redis;
    }

    public getGeneralRedis(): Redis {
        if (!this.generalRedis) {
            this.generalRedis = this.createRedisConnection('General', {
                maxRetriesPerRequest: 3,
                enableReadyCheck: true,
                lazyConnect: false,

            });
        }
        return this.generalRedis;
    }

    public getBullMQRedis(): Redis {
        if (!this.bullmqRedis) {
            this.bullmqRedis = this.createRedisConnection('BullMQ', {
                maxRetriesPerRequest: null, // Required for BullMQ
                enableReadyCheck: false,    // Required for BullMQ
                lazyConnect: true
            });
        }
        return this.bullmqRedis;
    }

    public async shutdown(): Promise<void> {
        this.isShuttingDown = true;
        console.log('Shutting down Redis connections...');

        const promises: Promise<void>[] = [];

        if (this.generalRedis) {
            // @ts-ignore
            promises.push(this.generalRedis.quit().catch(console.error));
        }

        if (this.bullmqRedis) {
            // @ts-ignore
            promises.push(this.bullmqRedis.quit().catch(console.error));
        }

        await Promise.allSettled(promises);

        this.generalRedis = null;
        this.bullmqRedis = null;
        console.log('All Redis connections closed');
    }
}

// Export singleton instance methods
const redisManager = RedisConnectionManager.getInstance();

export const getGeneralRedis = () => redisManager.getGeneralRedis();
export const getBullMQRedis = () => redisManager.getBullMQRedis();
export const shutdownRedis = () => redisManager.shutdown();

// Export default for backward compatibility
export default redisManager;