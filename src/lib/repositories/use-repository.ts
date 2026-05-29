"use client";

import { useCallback, useEffect, useState } from "react";
import type { CreateInput, Repository, UpdateInput } from "@/lib/repositories";

export function useRepository<
  T extends { id: string; createdAt: string; updatedAt: string },
>(repository: Repository<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const nextItems = await repository.list();
    setItems(nextItems);
    setIsLoaded(true);
  }, [repository]);

  useEffect(() => {
    queueMicrotask(() => void refresh());

    const onStorage = () => {
      void refresh();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("os-life:storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("os-life:storage", onStorage);
    };
  }, [refresh]);

  const create = useCallback(
    async (input: CreateInput<T>) => {
      const created = await repository.create(input);
      await refresh();
      return created;
    },
    [refresh, repository],
  );

  const update = useCallback(
    async (id: string, input: UpdateInput<T>) => {
      const updated = await repository.update(id, input);
      await refresh();
      return updated;
    },
    [refresh, repository],
  );

  const remove = useCallback(
    async (id: string) => {
      await repository.delete(id);
      await refresh();
    },
    [refresh, repository],
  );

  const clear = useCallback(async () => {
    await repository.clear();
    await refresh();
  }, [refresh, repository]);

  return { items, isLoaded, create, update, remove, clear, refresh };
}
