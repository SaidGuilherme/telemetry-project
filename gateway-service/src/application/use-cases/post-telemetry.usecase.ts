import { Inject, Injectable } from '@nestjs/common';
import { Telemetry } from '../../domain/entities/telemetry.entity';
import { MESSAGING_EVENT_BUS } from '../ports/messaging-event-bus.port';
import type { MessagingEventBusPort } from '../ports/messaging-event-bus.port';

@Injectable()
export class PostTelemetryUseCase {
  constructor(
    @Inject(MESSAGING_EVENT_BUS)
    private readonly messagingEventBus: MessagingEventBusPort
  ) {}

  async execute(telemetry: Telemetry): Promise<string> {
    await this.messagingEventBus.publish('telemetry.raw', telemetry);
    return 'Telemetry published successfully';
  }
}