import { Injectable, Inject } from "@nestjs/common";
import { CURRENT_STATUS_REPO } from "../ports/current-status.repository";
import type { CurrentStatusRepositoryPort } from "../ports/current-status.repository";

@Injectable()
export class GetStatusUseCase {
    constructor(
        @Inject(CURRENT_STATUS_REPO)
        private readonly currentStatusRepository: CurrentStatusRepositoryPort
    ) {}

    execute(machine_id: string): Promise<string> {
        console.log(`GetStatusUseCase machine_id: ${machine_id}`);
        return this.currentStatusRepository.getStatus(machine_id);
    }
}