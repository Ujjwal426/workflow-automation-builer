import { z } from "zod";

export const httpSchema = z.object({
  /**
   * Used for canvas label + readability
   */
  name: z.string().min(1, "Action name is required"),

  /**
   * Request URL
   */
  url: z.string().url("Valid URL is required"),

  /**
   * HTTP method
   */
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),

  /**
   * Optional request body
   * (used only for non-GET methods)
   */
  body: z.string().optional(),

  /**
   * Optional headers (JSON string for frontend-only app)
   */
  headers: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Headers must be valid JSON",
      }
    ),
});
