import { Injectable } from '@nestjs/common';
import { Telemetry } from '../../domain/entities/telemetry.entity';

@Injectable()
export class PostTelemetryUseCase {
  constructor() {}

  execute(telemetry: Telemetry): string {
    return `Got it! id: ${telemetry.machine_id}
    lat: ${telemetry.lat}
    lng: ${telemetry.lng}
    fuel: ${telemetry.fuel}
    speed: ${telemetry.speed}
    date: ${telemetry.timestamp}`;
  }
}