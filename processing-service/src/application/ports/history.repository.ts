export const HISTORY_REPO = 'HISTORY_REPO';

export interface HistoryRepositoryPort {
    saveHistory(machine_id: string, speed: number, fuel: number): Promise<void>;
    getHistory(machine_id: string): Promise<{ speed: number; fuel: number }[]>;
}