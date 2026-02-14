import { Module } from '@nestjs/common';
import { TelemetryController } from './api/controllers/v1/telemetry.controller';
import { PostTelemetryUseCase } from './application/use-cases/post-telemetry.usecase';

@Module({
  imports: [],
  controllers: [TelemetryController],
  providers: [PostTelemetryUseCase],
})
export class AppModule {}
