"use client";

import { localFinanceRepository } from "@/lib/repositories";
import { useRepository } from "@/lib/repositories/use-repository";

export function useFinances() {
  return useRepository(localFinanceRepository);
}
