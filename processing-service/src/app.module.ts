import { Module } from '@nestjs/common';
import { TelemetryController } from './api/telemetry.controller';
import { ProcessTelemetryUseCase } from './application/process-telemetry.usecase';
import { TelemetryConsumer } from './infra/telemetry.consumer';

@Module({
  imports: [],
  controllers: [TelemetryController],
  providers: [
    ProcessTelemetryUseCase,
    TelemetryConsumer
  ],
})
export class AppModule {}