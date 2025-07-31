import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// ✅ Import a unified schema (that includes both tables & relations)
import * as schema from "./schema";

const client = neon(process.env.DATABASE_URL!);

const db = drizzle(client, {
    schema,      // ✅ includes both tables and relations
    logger: true // ✅ useful for debugging SQL queries
});

export default db;
