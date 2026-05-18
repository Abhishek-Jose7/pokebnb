import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(3).max(140),
  body: z.string().min(5),
  target_role: z.enum(["all", "participant", "judge", "mentor"]).default("all"),
});
