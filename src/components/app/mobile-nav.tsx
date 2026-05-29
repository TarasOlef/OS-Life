"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileRoutes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/80 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-18px_55px_rgb(0_0_0/0.08)] backdrop-blur-2xl xl:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {mobileRoutes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.68rem] font-semibold transition-all active:scale-95",
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="truncate">{route.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
