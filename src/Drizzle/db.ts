import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg";
import * as schema from "./schema"
import { neon } from "@neondatabase/serverless";


export const client = neon(process.env.Database_URL!)

const db = drizzle(client, { schema, logger: false });
export default db;
//
// export const client = new Client({
//     connectionString: process.env.Database_URL as string,
// })
//
// const connectWithRetry = async (
//     maxRetries = 5,
//     delayMs = 3000
// ): Promise<void> => {
//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//             await client.connect();
//             console.log("✅ Connected to PostgreSQL");
//             return;
//         } catch (error: any) {
//             console.error(`❌ Attempt ${attempt} failed:`, error.message);
//
//             if (attempt === maxRetries) {
//                 console.error("💥 Max retries reached. Exiting.");
//                 process.exit(1);
//             }
//
//             console.log(`🔁 Retrying in ${delayMs / 1000} seconds...`);
//             await new Promise((resolve) => setTimeout(resolve, delayMs));
//         }
//     }
// };
//
// const main = async () => {
//     await connectWithRetry();
// };
//
//
//
// main()
//
// const db = drizzle(client, { schema, logger: true });
// export default db;