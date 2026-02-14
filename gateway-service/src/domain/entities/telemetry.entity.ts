export class Telemetry {
    constructor(
        public readonly lat: number,
        public readonly lng: number,
        public readonly speed: number,
        public readonly fuel: number,
        public readonly machine_id: number,
        public readonly timestamp: Date
    ) {}

    static create(params: {
        lat: number,
        lng: number,
        speed: number,
        fuel: number,
        machine_id: number,
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
}