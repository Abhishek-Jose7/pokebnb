import { z } from "zod";

export const scoreSchema = z.object({
  round_id: z.string().uuid(),
  team_id: z.string().uuid(),
  criteria_scores: z.record(z.string(), z.coerce.number().min(0)),
  remarks: z.string().max(2000).optional(),
});
