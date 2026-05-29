import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 rounded-md border border-input bg-secondary/40 px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring",
        props.className,
      )}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-24 rounded-md border border-input bg-secondary/40 px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring",
        props.className,
      )}
    />
  );
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 rounded-md border border-input bg-secondary/40 px-3 text-sm outline-none transition-colors focus:border-ring",
        props.className,
      )}
    />
  );
}
