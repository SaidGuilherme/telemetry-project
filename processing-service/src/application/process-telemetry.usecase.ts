import { Injectable } from '@nestjs/common';
import { Telemetry } from 'src/domain/entities/telemetry.entity';

@Injectable()
export class ProcessTelemetryUseCase {
  constructor() {}

  async execute(telemmetryData: Telemetry) {
    console.log('Processing telemetry data:', telemmetryData);
  }
}
