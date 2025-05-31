import dotenv from 'dotenv';

  import { drizzle } from "drizzle-orm/node-postgres"
  import { Client, Pool } from "pg"
  import * as schema from "./schema"

  export const client = new Client({
      connectionString: process.env.Database_URL as string
  })

//   const main = async () => {
//       await client.connect()
//   }
//   main().then(() => {
//       console.log("Connected to the database")
//   }).catch((error) => {
//       console.error("Error connecting to the database:", error)
//   })


//   const db = drizzle(client, { schema, logger: true })

//   export default db

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

pool.connect()
  .then(() => {
    console.log('Connected to the Neon database');
  })
  .catch((error) => {
    console.error('Error connecting to the Neon database:', error);
  });

const db = drizzle(pool, { schema });


export default db;