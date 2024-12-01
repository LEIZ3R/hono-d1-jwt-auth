import { Hono } from "hono";

const health = new Hono();

health.get("/", (c) => {
  return c.text("Hello from health!");
});

export default health;
