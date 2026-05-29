import { cn } from "@/lib/utils";

type ProgressRingProps = {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
};

export function ProgressRing({
  value,
  size = 112,
  stroke = 12,
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-foreground transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      {label ? (
        <span className="absolute text-sm font-semibold text-foreground">
          {label}
        </span>
      ) : null}
    </div>
  );
}
