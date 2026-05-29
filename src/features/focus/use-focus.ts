"use client";

import { localFocusRepository } from "@/lib/repositories";
import { useRepository } from "@/lib/repositories/use-repository";

export function useFocus() {
  return useRepository(localFocusRepository);
}
