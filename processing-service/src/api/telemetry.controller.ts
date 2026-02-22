import { Controller, Get, Param } from '@nestjs/common';
import { GetHistoryUseCase } from 'src/application/usecases/get-history.usecase';
import { GetStatusUseCase } from 'src/application/usecases/get-status.usecase';

@Controller()
export class TelemetryController {
  constructor(
    private readonly getStatusUsecase: GetStatusUseCase,
    private readonly getHistoryUsecase: GetHistoryUseCase
  ) {}

  @Get('status/:machine_id')
  getStatus(@Param('machine_id') machine_id: string) {
    console.log(`TelemetryController getStatus machine_id: ${machine_id}`);
    return this.getStatusUsecase.execute(machine_id);
  }

  @Get('history/:machine_id')
  getHistory(@Param('machine_id') machine_id: string) {
    console.log(`TelemetryController getHistory machine_id: ${machine_id}`);
    return this.getHistoryUsecase.execute(machine_id);
  }
}