// import "dotenv/config";
// import { migrate } from "drizzle-orm/node-postgres/migrator";
// import db, { client } from "./db";
//
// async function migration() {
//     console.log("......Migrations Started......");
//
//     if (!client) {
//         throw new Error("Client not initialized. Set RUN_MIGRATION=true.");
//     }
//
//     await migrate(db, { migrationsFolder: __dirname + "/migrations" });
//     await client.end();
//
//     console.log("......Migrations Completed......");
//     process.exit(0);
// }
//
// migration().catch((error) => {
//     console.error("Migration failed:", error);
//     process.exit(1);
// });
//
// //RUN_MIGRATION=true ts-node migrate.ts