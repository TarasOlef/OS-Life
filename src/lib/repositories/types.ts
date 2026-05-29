import type {
  BodyCheckin,
  DailyLog,
  FinanceTransaction,
  FocusSession,
  InvestmentPosition,
  NutritionEntry,
  TrainingSession,
} from "@/lib/data/schemas";

export type CreateInput<
  T extends { id: string; createdAt: string; updatedAt?: string },
> = Omit<T, "id" | "createdAt" | "updatedAt">;

export type UpdateInput<T extends { id: string }> = Partial<Omit<T, "id">>;

export type Repository<T extends { id: string }> = {
  list: () => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  create: (
    input: CreateInput<T & { createdAt: string; updatedAt: string }>,
  ) => Promise<T>;
  update: (id: string, input: UpdateInput<T>) => Promise<T | null>;
  delete: (id: string) => Promise<void>;
  clear: () => Promise<void>;
};

export type DailyLogRepository = Repository<DailyLog> & {
  upsertByDate: (
    date: string,
    input: Partial<Omit<DailyLog, "id" | "date" | "createdAt" | "updatedAt">>,
  ) => Promise<DailyLog>;
  getByDate: (date: string) => Promise<DailyLog | null>;
};

export type NutritionRepository = Repository<NutritionEntry>;
export type TrainingRepository = Repository<TrainingSession>;
export type BodyRepository = Repository<BodyCheckin>;
export type SleepRepository = DailyLogRepository;
export type FocusRepository = Repository<FocusSession>;
export type FinanceRepository = Repository<FinanceTransaction>;
export type InvestmentRepository = Repository<InvestmentPosition>;
