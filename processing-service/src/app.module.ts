import { Module } from '@nestjs/common';
import { TelemetryController } from './api/telemetry.controller';
import { ProcessTelemetryUseCase } from './application/usecases/process-telemetry.usecase';
import { TelemetryConsumer } from './infra/messaging/telemetry.consumer';
import { GetStatusUseCase } from './application/usecases/get-status.usecase';
import { GetHistoryUseCase } from './application/usecases/get-history.usecase';
import { RedisCurrentStatusAdapter } from './infra/adapters/redis.current-status.adapter';
import { InfluxHistoryAdapter } from './infra/adapters/influx.history.adapter';
import { MongoDBMetadataAdapter } from './infra/adapters/mongodb.metadata.adapter';
import { METADATA_REPO } from './application/ports/metadata.repository';
import { HISTORY_REPO } from './application/ports/history.repository';
import { CURRENT_STATUS_REPO } from './application/ports/current-status.repository';
import { ConfigModule } from '@nestjs/config';
import { RedisStreamAdapter } from './infra/adapters/redis-stream.adapter';
import { REAL_TIME_STREAM } from './application/ports/real-time-stream.port';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TelemetryController],
  providers: [
    ProcessTelemetryUseCase,
    GetStatusUseCase,
    GetHistoryUseCase,
    TelemetryConsumer,
    {
      provide: CURRENT_STATUS_REPO, 
      useClass: RedisCurrentStatusAdapter
    },
    {
      provide: HISTORY_REPO, 
      useClass: InfluxHistoryAdapter
    },
    {
      provide: METADATA_REPO, 
      useClass: MongoDBMetadataAdapter
    },
    {
      provide: REAL_TIME_STREAM, 
      useClass: RedisStreamAdapter
    }
  ],
})
export class AppModule {}