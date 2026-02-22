import { Inject, Injectable } from "@nestjs/common";
import { HISTORY_REPO } from "../ports/history.repository";
import type { HistoryRepositoryPort } from "../ports/history.repository";

@Injectable()
export class GetHistoryUseCase {
    constructor(
        @Inject(HISTORY_REPO)
        private readonly historyRepository: HistoryRepositoryPort
    ) {}

    execute(machine_id: string): Promise<{ speed: number; fuel: number }[]> {
        return this.historyRepository.getHistory(machine_id);
    }
}