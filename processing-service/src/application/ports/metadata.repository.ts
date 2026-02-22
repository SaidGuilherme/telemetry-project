import { Telemetry } from "src/domain/entities/telemetry.entity";

export const METADATA_REPO = 'METADATA_REPO';

export interface MetadataRepositoryPort {
    saveMetadata(machine_id: string, data: Telemetry): Promise<void>;
    getMetadata(machine_id: string): Promise<any>;
}