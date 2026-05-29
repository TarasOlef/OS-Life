"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AddEntryDialogProps = {
  title: string;
  description?: string;
  triggerLabel: string;
  trigger?: (open: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
  className?: string;
};

export function AddEntryDialog({
  title,
  description,
  triggerLabel,
  trigger,
  children,
  className,
}: AddEntryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  const close = () => setIsOpen(false);

  return (
    <>
      {trigger ? (
        trigger(() => setIsOpen(true))
      ) : (
        <Button type="button" onClick={() => setIsOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          {triggerLabel}
        </Button>
      )}
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-3 backdrop-blur-xl sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "os-animate-sheet max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-2xl",
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="text-xl font-semibold">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={close}
                aria-label="Close"
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-5">{children(close)}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
