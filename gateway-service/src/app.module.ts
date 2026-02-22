import { Module } from '@nestjs/common';
import { TelemetryController } from './api/controllers/v1/telemetry.controller';
import { PostTelemetryUseCase } from './application/use-cases/post-telemetry.usecase';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerAdapter } from './infra/messaging/kafka-producer.adapter';
import { MESSAGING_EVENT_BUS } from './application/ports/messaging-event-bus.port';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
            retry: {
              retries: 5,
              initialRetryTime: 500
            }
          },
          consumer: {
            groupId: 'gateway-consumer',
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TelemetryController],
  providers: [
    PostTelemetryUseCase, 
    {
      provide: MESSAGING_EVENT_BUS,
      useClass: KafkaProducerAdapter
    }
  ],
  exports: [PostTelemetryUseCase]
})
export class AppModule {}
