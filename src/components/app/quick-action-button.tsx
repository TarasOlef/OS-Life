import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuickActionButtonProps = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function QuickActionButton({
  label,
  href,
  icon: Icon,
}: QuickActionButtonProps) {
  return (
    <Button asChild variant="secondary" className="justify-start">
      <Link href={href}>
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}
