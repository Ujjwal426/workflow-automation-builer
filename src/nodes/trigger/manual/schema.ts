import { z } from "zod";

export const manualTriggerSchema = z.object({
  name: z.string().trim().min(1, "Trigger name is required"),
  description: z.string().optional().default(""),
});
