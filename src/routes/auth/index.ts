import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, name } from "drizzle-orm";
import { sign, verify } from "hono/jwt";

import { zUserValidator } from "./utils/login-validator";
import { zRegisterValidator } from "./utils/register-validator";
import { usersTable } from "../../../db/user-schema";
import { deriveSalt, hashPassword, verifyPassword } from "./utils/hashPassword";
import { User } from "./models/user";

const auth = new Hono<{ Bindings: { DB: D1Database; JWT_SECRET: string } }>();

auth.post("/login", zUserValidator, async (c) => {
  const { email, password } = c.req.valid("json");
  const db = drizzle(c.env.DB);
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .get();

  if (!user) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const { password: storedPassword } = user;
  const isPasswordValid = await verifyPassword(password, email, storedPassword);

  if (!isPasswordValid) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const payload = {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 5,
  };

  const token = await sign(payload, c.env.JWT_SECRET);

  return c.json({ message: "Login successful", token: token }, 200);
});

auth.post("/register", zRegisterValidator, async (c) => {
  try {
    const { password, email, ...userData } = c.req.valid("json");
    const salt = await deriveSalt(email);
    const hash = await hashPassword(password, salt);
    const db = drizzle(c.env.DB);

    const newUser: User = {
      email,
      password: hash,
      ...userData,
    };

    await db.insert(usersTable).values(newUser);
    return c.json({ message: "User created successfully" }, 201);
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});

export default auth;
