import { Module } from '@nestjs/common';
import { TelemetryController } from './api/controllers/v1/telemetry.controller';
import { PostTelemetryUseCase } from './application/use-cases/post-telemetry.usecase';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaEventBusAdapter } from './infra/messaging/kafka-event-bus.adapter';
import { MESSAGING_EVENT_BUS } from './application/ports/messaging-event-bus.port';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'gateway-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TelemetryController],
  providers: [
    PostTelemetryUseCase, 
    {
      provide: MESSAGING_EVENT_BUS,
      useClass: KafkaEventBusAdapter
    }
  ],
  exports: [PostTelemetryUseCase]
})
export class AppModule {}
