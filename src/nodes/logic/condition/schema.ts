import { z } from "zod";

export const conditionSchema = z.object({
  field: z.enum(["status", "ok"]),
  operator: z.enum(["eq", "neq"]),
  value: z.number(),
});
