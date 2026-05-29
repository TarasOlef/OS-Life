"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingActionButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

export function FloatingActionButton({
  label,
  onClick,
  className,
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "fixed bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] right-5 z-50 flex size-16 items-center justify-center rounded-full bg-[#17151f] text-white shadow-[0_20px_50px_rgb(0_0_0/0.24)] transition-transform active:scale-95 xl:hidden",
        className,
      )}
    >
      <Plus className="size-8" strokeWidth={2.2} aria-hidden="true" />
    </button>
  );
}
