type MacroPillProps = {
  label: string;
  value: number;
};

export function MacroPill({ label, value }: MacroPillProps) {
  return (
    <div className="rounded-full bg-secondary/70 px-3 py-1 text-xs font-semibold text-foreground">
      {label} {value}g
    </div>
  );
}
