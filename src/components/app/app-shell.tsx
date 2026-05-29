import type { ReactNode } from "react";
import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="min-h-screen px-4 pb-28 pt-5 sm:px-6 xl:ml-72 xl:px-8 xl:pb-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
