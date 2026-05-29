"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileRoutes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur xl:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {mobileRoutes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[0.68rem] font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
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
