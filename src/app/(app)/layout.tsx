import type { ReactNode } from "react";
import { AppShell } from "@/components/app/app-shell";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  // Auth is intentionally not connected in the local-first sprint.
  return <AppShell>{children}</AppShell>;
}
