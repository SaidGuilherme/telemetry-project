import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { ProcessTelemetryUseCase } from "src/application/usecases/process-telemetry.usecase";
import { Telemetry } from "src/domain/entities/telemetry.entity";

@Injectable()
export class TelemetryConsumer implements OnModuleInit {
    constructor(
        private processTelemetryUseCase: ProcessTelemetryUseCase
    ) {}
  
    async onModuleInit() {
        console.log('Starting TelemetryConsumer...');
        try{

            const kafka = new Kafka({
                clientId: process.env.KAFKA_CONSUMER_CLIENT_ID || 'processing-service',
                brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
            });
    
            const consumer = kafka.consumer({ groupId: 'processing-group' });
            let isConnected = false;
            while (!isConnected) {
                try {
                    await consumer.connect();
                    isConnected = true;
                } catch (error) {
                    console.error('Error connecting to Kafka, retrying in 5 seconds...', error);
                    await new Promise(res => setTimeout(res, 5000));
                }
            }

            await consumer.subscribe({ topic: 'telemetry.raw', fromBeginning: false });
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
        } catch (error) {
            console.error('Error in TelemetryConsumer:', error);
        }
    }
}