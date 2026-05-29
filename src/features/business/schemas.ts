import { z } from "zod";

const optionalNullableText = z.string().trim().nullable();

export const businessLogSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  title: optionalNullableText,
  durationMinutes: z.coerce.number().finite().positive(),
  category: z.string().trim().min(1),
  notes: optionalNullableText,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type BusinessLog = z.infer<typeof businessLogSchema>;
