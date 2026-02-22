import { Body, Controller, Post } from '@nestjs/common';
import { PostTelemetryUseCase } from '../../../application/use-cases/post-telemetry.usecase';
import { Telemetry } from 'src/domain/entities/telemetry.entity';
import { TelemetryDto } from 'src/application/dtos/telemetry.dto';

@Controller('v1/telemetry')
export class TelemetryController {
  constructor(
    private readonly postTelemetryUseCase: PostTelemetryUseCase
  ) {}

  @Post()
  async postTelemetry(@Body() dto: TelemetryDto): Promise<string> {
    const telemetry = Telemetry.fromDto(dto);
    return await this.postTelemetryUseCase.execute(telemetry);
  }
}