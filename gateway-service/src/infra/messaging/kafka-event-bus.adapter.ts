import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from '@nestjs/microservices';
import { MessagingEventBusPort } from "src/application/ports/messaging-event-bus.port";

@Injectable()
export class KafkaEventBusAdapter implements MessagingEventBusPort, OnModuleInit {
    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka
    ) {}

    async onModuleInit() {
        try{
            await this.kafkaService.connect();
            console.log('KafkaEventBusAdapter connected to Kafka');
        } catch (error) {
            console.error('Error connecting to Kafka:', error);
        }
    }

    async publish(eventTopic: string, eventPayload: any): Promise<void> {
        this.kafkaService.emit(eventTopic, eventPayload);
    }
}