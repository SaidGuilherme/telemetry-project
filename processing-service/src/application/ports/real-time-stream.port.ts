export const REAL_TIME_STREAM = 'REAL_TIME_STREAM';

export interface RealTimeStreamPort {
    publish(event: any): Promise<void>;
}