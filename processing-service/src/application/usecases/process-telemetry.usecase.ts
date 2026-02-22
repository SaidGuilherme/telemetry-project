import { Inject, Injectable } from '@nestjs/common';
import { Telemetry } from 'src/domain/entities/telemetry.entity';
import { CURRENT_STATUS_REPO } from '../ports/current-status.repository';
import { HISTORY_REPO } from '../ports/history.repository';
import { METADATA_REPO } from '../ports/metadata.repository';
import { REAL_TIME_STREAM } from '../ports/real-time-stream.port';
import type { CurrentStatusRepositoryPort } from '../ports/current-status.repository';
import type { HistoryRepositoryPort } from '../ports/history.repository';
import type { MetadataRepositoryPort } from '../ports/metadata.repository';
import type { RealTimeStreamPort } from '../ports/real-time-stream.port';

@Injectable()
export class ProcessTelemetryUseCase {
  constructor(
    @Inject(CURRENT_STATUS_REPO)
    private readonly currentStatusRepository: CurrentStatusRepositoryPort,
    @Inject(HISTORY_REPO)
    private readonly historyRepository: HistoryRepositoryPort,
    @Inject(METADATA_REPO)
    private readonly metadataRepository: MetadataRepositoryPort,
    @Inject(REAL_TIME_STREAM)
    private readonly realTimeStreamRepository: RealTimeStreamPort
  ) {}

  async execute(telemmetryData: Telemetry) {
    console.log('Processing telemetry data:', telemmetryData);

    await this.currentStatusRepository.saveStatus(telemmetryData.machine_id, telemmetryData);
    await this.historyRepository.saveHistory(telemmetryData.machine_id, telemmetryData.speed, telemmetryData.fuel);

    if (telemmetryData.speed > 80) {
      await this.metadataRepository.saveMetadata(telemmetryData.machine_id, telemmetryData);
    }

    await this.realTimeStreamRepository.publish(telemmetryData);
  }
}
