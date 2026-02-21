import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from '@nestjs/microservices';
import { MessagingEventBusPort } from "src/application/ports/messaging-event-bus.port";

@Injectable()
export class KafkaEventBusAdapter implements MessagingEventBusPort, OnModuleInit {
    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka
    ) {}

    async onModuleInit() {
        await this.kafkaService.connect();
    }

    async publish(eventTopic: string, eventPayload: any): Promise<void> {
        this.kafkaService.emit(eventTopic, eventPayload);
    }
}