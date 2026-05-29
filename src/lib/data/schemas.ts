import { z } from "zod";

const nullableNumber = z.coerce.number().finite().nullable();
const optionalNullableText = z.string().trim().nullable();

export const dailyLogSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  bodyWeightKg: nullableNumber,
  sleepHours: nullableNumber,
  sleepQuality: nullableNumber,
  caloriesConsumed: nullableNumber,
  proteinG: nullableNumber,
  focusMinutes: nullableNumber,
  moneySpent: nullableNumber,
  lifeScore: nullableNumber,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const nutritionEntrySchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  mealName: optionalNullableText,
  calories: nullableNumber,
  proteinG: nullableNumber,
  carbsG: nullableNumber,
  fatG: nullableNumber,
  imageUrl: optionalNullableText,
  aiEstimated: z.boolean(),
  notes: optionalNullableText,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const trainingSetSchema = z.object({
  id: z.string().min(1),
  exerciseName: z.string().min(1),
  muscleGroup: optionalNullableText,
  setNumber: z.coerce.number().int().positive(),
  reps: nullableNumber,
  weightKg: nullableNumber,
  rir: nullableNumber,
  createdAt: z.string().min(1),
});

export const trainingSessionSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  title: z.string().min(1),
  durationMinutes: nullableNumber,
  perceivedEffort: nullableNumber,
  notes: optionalNullableText,
  sets: z.array(trainingSetSchema),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const bodyCheckinSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  weightKg: nullableNumber,
  waistCm: nullableNumber,
  chestCm: nullableNumber,
  armCm: nullableNumber,
  bodyPhotoUrl: optionalNullableText,
  notes: optionalNullableText,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const focusSessionSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  title: optionalNullableText,
  durationMinutes: z.coerce.number().finite().positive(),
  project: optionalNullableText,
  qualityScore: nullableNumber,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const financeTransactionSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  amount: z.coerce.number().finite().positive(),
  currency: z.string().min(1).default("EUR"),
  category: z.string().min(1),
  description: optionalNullableText,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const investmentPositionSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().trim().min(1),
  assetName: optionalNullableText,
  quantity: z.coerce.number().finite().positive(),
  averageBuyPrice: nullableNumber,
  currentPrice: nullableNumber,
  currency: z.string().min(1).default("USD"),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const aiInsightSchema = z.object({
  id: z.string().min(1),
  insightType: z.string().min(1),
  sourceModule: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  payloadJson: z.record(z.string(), z.unknown()).nullable(),
  createdAt: z.string().min(1),
});

export type DailyLog = z.infer<typeof dailyLogSchema>;
export type NutritionEntry = z.infer<typeof nutritionEntrySchema>;
export type TrainingSet = z.infer<typeof trainingSetSchema>;
export type TrainingSession = z.infer<typeof trainingSessionSchema>;
export type BodyCheckin = z.infer<typeof bodyCheckinSchema>;
export type FocusSession = z.infer<typeof focusSessionSchema>;
export type FinanceTransaction = z.infer<typeof financeTransactionSchema>;
export type InvestmentPosition = z.infer<typeof investmentPositionSchema>;
export type AIInsight = z.infer<typeof aiInsightSchema>;
