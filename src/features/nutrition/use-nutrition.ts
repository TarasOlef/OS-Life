"use client";

import { localNutritionRepository } from "@/lib/repositories";
import { useRepository } from "@/lib/repositories/use-repository";

export function useNutrition() {
  return useRepository(localNutritionRepository);
}
