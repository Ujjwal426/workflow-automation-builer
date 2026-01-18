import { z } from "zod";

export const emailSchema = z.object({
  /**
   * Used for canvas label
   */
  name: z.string().min(1, "Action name is required"),

  /**
   * Email message body
   */
  message: z.string().min(1, "Message is required"),
});
