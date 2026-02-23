import {
    IsNumber,
    Min,
    Max,
    IsDate,
    IsString
} from 'class-validator';
import { Type } from 'class-transformer';

export class TelemetryDto {
    @Type(() => Number)
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat: number;

    @Type(() => Number)
    @IsNumber()
    @Min(-180)
    @Max(180)
    lng: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(300)
    speed: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(100)
    fuel: number;

    @Type(() => String)
    @IsString()
    machine_id: string;

    @Type(() => Date)
    @IsDate()
    timestamp: Date;
}