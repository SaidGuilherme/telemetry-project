import { InfluxDB, Point } from "@influxdata/influxdb-client";
import { HistoryRepositoryPort } from "src/application/ports/history.repository";

export class InfluxHistoryAdapter implements HistoryRepositoryPort {
    private client = new InfluxDB({
        url: process.env.INFLUX_URL || 'http://localhost:8086',
        token: process.env.INFLUX_TOKEN
    });

    private writeApi = this.client.getWriteApi(
        process.env.INFLUX_ORG || 'org',
        process.env.INFLUX_BUCKET || 'telemetry');

    private queryApi = this.client.getQueryApi(
        process.env.INFLUX_ORG || 'org'
    );

    saveHistory(machine_id: string, speed: number, fuel: number): Promise<void> {
        try{
            console.log(`Saving history for machine ${machine_id}: speed=${speed}, fuel=${fuel}`);
            const point = new Point("machine_history")
                .tag("machine_id", machine_id.toString())
                .floatField("speed", speed)
                .floatField("fuel", fuel);
    
            this.writeApi.writePoint(point);
            return this.writeApi.flush();
        } catch (error) {
            console.error(`Error saving history for machine ${machine_id}:`, error);
            throw error;
        }
    }

    getHistory(machine_id: string): Promise<{ speed: number; fuel: number; }[]> {
        const bucket = process.env.INFLUX_BUCKET || 'telemetry';

    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "machine_history")
        |> filter(fn: (r) => r.machine_id == "${machine_id}")
        |> filter(fn: (r) => r._field == "speed" or r._field == "fuel")
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> keep(columns: ["speed", "fuel"])
    `;

    const results: { speed: number; fuel: number }[] = [];

    return new Promise((resolve, reject) => {
      this.queryApi.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const data = tableMeta.toObject(row);

          results.push({
            speed: data.speed,
            fuel: data.fuel,
          });
        },
        error: (error) => {
          console.error('Error querying InfluxDB:', error);
          reject(error);
        },
        complete: () => {
          resolve(results);
        },
      });
    });
    }
}