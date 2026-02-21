import { Body, Controller, Post } from '@nestjs/common';
import { PostTelemetryUseCase } from '../../../application/use-cases/post-telemetry.usecase';
import { Telemetry } from 'src/domain/entities/telemetry.entity';

@Controller('v1/telemetry')
export class TelemetryController {
  constructor(
    private readonly postTelemetryUseCase: PostTelemetryUseCase
  ) {}

  @Post()
  async postTelemetry(@Body() telemetry: Telemetry): Promise<string> {
    return await this.postTelemetryUseCase.execute(telemetry);
  }
}