import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const registerSchema = z.object({
  name: z.string().min(2).toLowerCase(),
  lastName: z.string().min(2).toLowerCase(),
  email: z.string().min(1).email(),
  phone: z.string().min(1),
  password: z
    .string()
    .min(1)
    .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        "The password must have a Uppercase, lowercase letter and a number",
    }),
});

export const zRegisterValidator = zValidator("json", registerSchema);
