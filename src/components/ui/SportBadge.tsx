import { cn } from "@/lib/utils";

export type SportType = "badminton" | "tennis" | "basketball" | "volleyball" | "table-tennis" | "soccer";

interface SportBadgeProps {
  sport: SportType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sportConfig: Record<SportType, { label: string; emoji: string; bgClass: string; textClass: string }> = {
  badminton: { label: "羽球", emoji: "🏸", bgClass: "bg-primary/10", textClass: "text-primary" },
  tennis: { label: "網球", emoji: "🎾", bgClass: "bg-sport-tennis/10", textClass: "text-sport-tennis" },
  basketball: { label: "籃球", emoji: "🏀", bgClass: "bg-sport-basketball/10", textClass: "text-sport-basketball" },
  volleyball: { label: "排球", emoji: "🏐", bgClass: "bg-sport-volleyball/10", textClass: "text-sport-volleyball" },
  "table-tennis": { label: "桌球", emoji: "🏓", bgClass: "bg-sport-table-tennis/10", textClass: "text-sport-table-tennis" },
  soccer: { label: "足球", emoji: "⚽", bgClass: "bg-sport-soccer/10", textClass: "text-sport-soccer" },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function SportBadge({ sport, size = "md", className }: SportBadgeProps) {
  const config = sportConfig[sport];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
        config.bgClass,
        config.textClass,
        sizeClasses[size],
        className
      )}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}

export function SportIcon({ sport, className }: { sport: SportType; className?: string }) {
  const config = sportConfig[sport];
  return <span className={className}>{config.emoji}</span>;
}

export { sportConfig };
