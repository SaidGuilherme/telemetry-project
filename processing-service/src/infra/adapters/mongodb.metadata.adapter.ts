import { MetadataRepositoryPort } from "src/application/ports/metadata.repository";
import { MongoClient } from "mongodb";

export class MongoDBMetadataAdapter implements MetadataRepositoryPort {
    private client = new MongoClient(process.env.MONGO_URI || "mongodb://mongodb:27017");

    async saveMetadata(machine_id: string, data: any): Promise<void> {
        try{
            console.log(`Saving metadata for machine ${machine_id}:`, data);
            await this.client.connect();
            const db = this.client.db(process.env.MONGO_DB || "telemetry");
            const collection = db.collection("metadata");
            await collection.insertOne({ machine_id, ...data });
        } catch (error) {
            console.error(`Error saving metadata for machine ${machine_id}:`, error);
        }
    }
    
    getMetadata(machine_id: string): Promise<any> {
        try{
            console.log(`Getting metadata for machine ${machine_id}`);
            return new Promise(async (resolve, reject) => {
                try {
                    await this.client.connect();
                    const db = this.client.db(process.env.MONGO_DB || "telemetry");
                    const collection = db.collection("metadata");
                    const metadata = await collection.find({ machine_id }).toArray();
                    resolve(metadata);
                } catch (error) {
                    reject(error);
                }
            });
        } catch (error) {
            console.error(`Error getting metadata for machine ${machine_id}:`, error);
            return Promise.reject(error);
        }
    }
}