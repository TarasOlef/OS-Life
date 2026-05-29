"use client";

import { z } from "zod";
import {
  bodyCheckinSchema,
  dailyLogSchema,
  financeTransactionSchema,
  focusSessionSchema,
  investmentPositionSchema,
  nutritionEntrySchema,
  trainingSessionSchema,
  type BodyCheckin,
  type DailyLog,
  type FinanceTransaction,
  type FocusSession,
  type InvestmentPosition,
  type NutritionEntry,
  type TrainingSession,
} from "@/lib/data/schemas";
import type {
  BodyRepository,
  CreateInput,
  DailyLogRepository,
  FinanceRepository,
  FocusRepository,
  InvestmentRepository,
  NutritionRepository,
  Repository,
  TrainingRepository,
  UpdateInput,
} from "@/lib/repositories/types";

export const osLifeStorageKeys = {
  dailyLogs: "os-life:daily-logs",
  nutritionEntries: "os-life:nutrition-entries",
  trainingSessions: "os-life:training-sessions",
  bodyCheckins: "os-life:body-checkins",
  focusSessions: "os-life:focus-sessions",
  financeTransactions: "os-life:finance-transactions",
  investmentPositions: "os-life:investment-positions",
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function readItems<T>(key: string, schema: z.ZodType<T>): T[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return [];
  }

  try {
    const parsed = z.array(schema).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function writeItems<T>(key: string, items: T[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event("os-life:storage"));
}

function createLocalRepository<
  T extends { id: string; createdAt: string; updatedAt: string },
>(key: string, schema: z.ZodType<T>): Repository<T> {
  return {
    async list() {
      return readItems(key, schema).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
    },
    async getById(id) {
      return readItems(key, schema).find((item) => item.id === id) ?? null;
    },
    async create(input: CreateInput<T>) {
      const item = {
        ...input,
        id: createId(),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      } as T;
      const items = readItems(key, schema);
      writeItems(key, [item, ...items]);
      return item;
    },
    async update(id: string, input: UpdateInput<T>) {
      const items = readItems(key, schema);
      const existing = items.find((item) => item.id === id);
      if (!existing) {
        return null;
      }

      const updated = { ...existing, ...input, updatedAt: nowIso() };
      writeItems(
        key,
        items.map((item) => (item.id === id ? updated : item)),
      );
      return updated;
    },
    async delete(id) {
      writeItems(
        key,
        readItems(key, schema).filter((item) => item.id !== id),
      );
    },
    async clear() {
      writeItems(key, []);
    },
  };
}

export const localDailyLogRepository: DailyLogRepository = {
  ...createLocalRepository<DailyLog>(
    osLifeStorageKeys.dailyLogs,
    dailyLogSchema,
  ),
  async getByDate(date) {
    return (
      readItems(osLifeStorageKeys.dailyLogs, dailyLogSchema).find(
        (item) => item.date === date,
      ) ?? null
    );
  },
  async upsertByDate(date, input) {
    const existing = await localDailyLogRepository.getByDate(date);
    if (existing) {
      const updated = await localDailyLogRepository.update(existing.id, input);
      return updated ?? existing;
    }

    return localDailyLogRepository.create({
      date,
      bodyWeightKg: input.bodyWeightKg ?? null,
      sleepHours: input.sleepHours ?? null,
      sleepQuality: input.sleepQuality ?? null,
      caloriesConsumed: input.caloriesConsumed ?? null,
      proteinG: input.proteinG ?? null,
      focusMinutes: input.focusMinutes ?? null,
      moneySpent: input.moneySpent ?? null,
      lifeScore: input.lifeScore ?? null,
    });
  },
};

export const localNutritionRepository: NutritionRepository =
  createLocalRepository<NutritionEntry>(
    osLifeStorageKeys.nutritionEntries,
    nutritionEntrySchema,
  );

export const localTrainingRepository: TrainingRepository =
  createLocalRepository<TrainingSession>(
    osLifeStorageKeys.trainingSessions,
    trainingSessionSchema,
  );

export const localBodyRepository: BodyRepository =
  createLocalRepository<BodyCheckin>(
    osLifeStorageKeys.bodyCheckins,
    bodyCheckinSchema,
  );

export const localFocusRepository: FocusRepository =
  createLocalRepository<FocusSession>(
    osLifeStorageKeys.focusSessions,
    focusSessionSchema,
  );

export const localFinanceRepository: FinanceRepository =
  createLocalRepository<FinanceTransaction>(
    osLifeStorageKeys.financeTransactions,
    financeTransactionSchema,
  );

export const localInvestmentRepository: InvestmentRepository =
  createLocalRepository<InvestmentPosition>(
    osLifeStorageKeys.investmentPositions,
    investmentPositionSchema,
  );

export async function clearAllLocalData() {
  await Promise.all([
    localDailyLogRepository.clear(),
    localNutritionRepository.clear(),
    localTrainingRepository.clear(),
    localBodyRepository.clear(),
    localFocusRepository.clear(),
    localFinanceRepository.clear(),
    localInvestmentRepository.clear(),
  ]);
}
