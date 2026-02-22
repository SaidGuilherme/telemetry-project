import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { ProcessTelemetryUseCase } from "src/application/process-telemetry.usecase";
import { Telemetry } from "src/domain/entities/telemetry.entity";

@Injectable()
export class TelemetryConsumer implements OnModuleInit {
    constructor(
        private processTelemetryUseCase: ProcessTelemetryUseCase
    ) {}
  
    async onModuleInit() {
        console.log('Starting TelemetryConsumer...');
        const kafka = new Kafka({
            clientId: 'processing-service',
            brokers: ['kafka:9092']
        });

        const consumer = kafka.consumer({ groupId: 'processing-group' });

        await consumer.connect();
        await consumer.subscribe({ topic: 'telemetry.raw', fromBeginning: true });
        console.log('TelemetryConsumer connected and subscribed to telemetry.raw topic');

        await consumer.run({
            eachMessage: async ({ message }) => {
                if (!message.value) return;
                const telemetryData = JSON.parse(message.value.toString());

                const telemetry = new Telemetry(
                    telemetryData.lat,
                    telemetryData.lng,
                    telemetryData.speed,
                    telemetryData.fuel,
                    telemetryData.machine_id,
                    new Date(telemetryData.timestamp)
                )
                await this.processTelemetryUseCase.execute(telemetry);
            }
        });
    }
}