"use client";

import { z } from "zod";
import {
  businessLogSchema,
  type BusinessLog,
} from "@/features/business/schemas";
import type { CreateInput, Repository, UpdateInput } from "@/lib/repositories";

export const businessStorageKey = "os-life:business-logs";

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

function readBusinessLogs() {
  if (!canUseLocalStorage()) return [];
  const raw = window.localStorage.getItem(businessStorageKey);
  if (!raw) return [];

  try {
    const parsed = z.array(businessLogSchema).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function writeBusinessLogs(items: BusinessLog[]) {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(businessStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("os-life:storage"));
}

export type BusinessRepository = Repository<BusinessLog>;

export const localBusinessRepository: BusinessRepository = {
  async list() {
    return readBusinessLogs().sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  },
  async getById(id) {
    return readBusinessLogs().find((item) => item.id === id) ?? null;
  },
  async create(input: CreateInput<BusinessLog>) {
    const item: BusinessLog = {
      ...input,
      id: createId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    writeBusinessLogs([item, ...readBusinessLogs()]);
    return item;
  },
  async update(id: string, input: UpdateInput<BusinessLog>) {
    const items = readBusinessLogs();
    const existing = items.find((item) => item.id === id);
    if (!existing) return null;

    const updated = { ...existing, ...input, updatedAt: nowIso() };
    writeBusinessLogs(items.map((item) => (item.id === id ? updated : item)));
    return updated;
  },
  async delete(id) {
    writeBusinessLogs(readBusinessLogs().filter((item) => item.id !== id));
  },
  async clear() {
    writeBusinessLogs([]);
  },
};
