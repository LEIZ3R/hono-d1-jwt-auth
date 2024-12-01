import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/user-schema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
});
