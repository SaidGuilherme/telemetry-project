import { Telemetry } from "src/domain/entities/telemetry.entity";

export const CURRENT_STATUS_REPO = 'CURRENT_STATUS_REPO';

export interface CurrentStatusRepositoryPort {
    saveStatus(machine_id: string, data: Telemetry): Promise<void>;
    getStatus(machine_id: string): Promise<string>;
}