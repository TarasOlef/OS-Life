"use client";

import { localBodyRepository } from "@/lib/repositories";
import { useRepository } from "@/lib/repositories/use-repository";

export function useBody() {
  return useRepository(localBodyRepository);
}
