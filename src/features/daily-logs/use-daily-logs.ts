"use client";

import { useCallback, useEffect, useState } from "react";
import type { DailyLog } from "@/lib/data/schemas";
import { localDailyLogRepository } from "@/lib/repositories";

export function useDailyLogs() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setLogs(await localDailyLogRepository.list());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void refresh());
    const onStorage = () => void refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("os-life:storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("os-life:storage", onStorage);
    };
  }, [refresh]);

  const upsertByDate = useCallback(
    async (
      date: string,
      input: Partial<Omit<DailyLog, "id" | "date" | "createdAt" | "updatedAt">>,
    ) => {
      const log = await localDailyLogRepository.upsertByDate(date, input);
      await refresh();
      return log;
    },
    [refresh],
  );

  return { logs, isLoaded, upsertByDate, refresh };
}
