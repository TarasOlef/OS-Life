"use client";

import { localInvestmentRepository } from "@/lib/repositories";
import { useRepository } from "@/lib/repositories/use-repository";

export function useInvestments() {
  return useRepository(localInvestmentRepository);
}
