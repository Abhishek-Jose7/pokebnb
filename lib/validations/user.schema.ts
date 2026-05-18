import { z } from "zod";

export const userSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "judge", "participant", "mentor"]),
  team_name: z.string().optional(),
});
