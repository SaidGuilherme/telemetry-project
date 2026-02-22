import { Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { RealTimeStreamPort } from "src/application/ports/real-time-stream.port";

@Injectable()
export class RedisStreamAdapter implements RealTimeStreamPort, OnModuleInit {
    private redisClient: Redis;
    private streamName = 'telemetry.processed';

    async onModuleInit() {
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST || 'redis',
            port: parseInt(process.env.REDIS_PORT || '6379') ,
        });
    }

    async publish(event: any): Promise<void> {
        await this.redisClient.xadd(this.streamName, '*', 'data', JSON.stringify(event));
    }
}