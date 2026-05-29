"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appRoutes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-background/80 px-4 py-5 backdrop-blur xl:block">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-sm font-semibold">
          OS
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">OS-Life</p>
          <p className="text-xs text-muted-foreground">Private LifeOS</p>
        </div>
      </Link>

      <nav className="space-y-1">
        {appRoutes.map((route) => {
          const isActive = pathname === route.href;
          const Icon = route.icon;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span>{route.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute inset-x-4 bottom-5 rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">Local-first mode</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Data is stored in this browser. Backend and external APIs are planned
          for later server-side sprints.
        </p>
      </div>
    </aside>
  );
}
