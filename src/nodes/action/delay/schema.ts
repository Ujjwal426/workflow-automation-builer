// nodes/action/delay/schema.ts
import { z } from "zod";

export const delaySchema = z.object({
  /**
   * Label shown on canvas
   */
  name: z.string().min(1, "Action name is required"),

  /**
   * Delay duration in seconds
   */
  duration: z
    .number()
    .refine((val) => val !== undefined, {
      message: "Duration is required",
    })
    .min(1, "Minimum delay is 1 second")
    .max(3600, "Maximum delay is 1 hour"),
});
