import { Hono } from "hono";
import auth from "./routes/auth";
import health from "./routes/health";

const app = new Hono().basePath("api");

app.route("auth", auth);
app.route("health", health);

export default app;

