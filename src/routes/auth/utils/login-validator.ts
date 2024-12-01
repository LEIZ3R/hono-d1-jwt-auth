import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z
    .string()
    .min(1)
    .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        "The password must have a Uppercase, lowercase letter and a number",
    }),
});

export const zUserValidator = zValidator("json", loginSchema);
