"use client";

import { localTrainingRepository } from "@/lib/repositories";
import { useRepository } from "@/lib/repositories/use-repository";

export function useTraining() {
  return useRepository(localTrainingRepository);
}
