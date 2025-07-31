//drizzle-kit used for migrations,seeding,pushing..
import "dotenv/config";
import {defineConfig} from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",
    dbCredentials:{
        url: process.env.DATABASE_URL as string,
    },
    verbose: true, //means to enable or set to true detailed output in what is shown at the screen when logging or output
    strict: true,
});