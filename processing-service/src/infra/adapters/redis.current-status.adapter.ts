import Redis from 'ioredis';
import { CurrentStatusRepositoryPort } from 'src/application/ports/current-status.repository';

export class RedisCurrentStatusAdapter implements CurrentStatusRepositoryPort {
    private client = new Redis({
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    });

    async saveStatus(machine_id: string, data: any): Promise<void> {
        try{
            console.log(`Saving status for machine ${machine_id}:`, data);
            await this.client.set(`machine:${machine_id}`, JSON.stringify(data))
        } catch (error) {
            console.error(`Error saving status for machine ${machine_id}:`, error);
        }
    }

    async getStatus(machine_id: string): Promise<string> {
        try{
            console.log(`Getting status for machine ${machine_id}`);
            const data = await this.client.get(`machine:${machine_id}`);
            if (!data) return "No data";
    
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error getting status for machine ${machine_id}:`, error);
            return "Error retrieving data";
        }
    }
}