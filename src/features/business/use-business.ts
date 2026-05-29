"use client";

import { localBusinessRepository } from "@/features/business/repository";
import { useRepository } from "@/lib/repositories/use-repository";

export function useBusiness() {
  return useRepository(localBusinessRepository);
}
