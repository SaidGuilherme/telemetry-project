export class Telemetry {
    constructor(
        public readonly lat: number,
        public readonly lng: number,
        public readonly speed: number,
        public readonly fuel: number,
        public readonly machine_id: string,
        public readonly timestamp: Date
    ) {}

    static create(params: {
        lat: number,
        lng: number,
        speed: number,
        fuel: number,
        machine_id: string,
        timestamp: Date
    }) : Telemetry {
        return new Telemetry(
            params.lat,
            params.lng,
            params.speed,
            params.fuel,
            params.machine_id,
            params.timestamp
        )
    }

    static fromDto(dto: {
        lat: number,
        lng: number,
        speed: number,
        fuel: number,
        machine_id: string,
        timestamp: Date
    }) : Telemetry {
        return new Telemetry(
            dto.lat,
            dto.lng,
            dto.speed,
            dto.fuel,
            dto.machine_id,
            new Date(dto.timestamp)
        )
    }
}