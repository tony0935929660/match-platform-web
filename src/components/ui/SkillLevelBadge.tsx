import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SportType, sportConfig } from "./SportBadge";

interface SkillLevelBadgeProps {
  level: number; // 1-8
  confidence?: "high" | "medium" | "low";
  trend?: "up" | "down" | "stable";
  sport?: SportType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const levelLabels: Record<number, string> = {
  1: "L1",
  2: "L2 (N2)",
  3: "L3 (N3)",
  4: "L4 (N4)",
  5: "L5 (N5)",
  6: "L6 (A)",
  7: "L7 (B)",
  8: "L8 (C)",
};

const confidenceColors = {
  high: "border-credit-high bg-credit-high/10 text-credit-high",
  medium: "border-credit-medium bg-credit-medium/10 text-credit-medium",
  low: "border-credit-low bg-credit-low/10 text-credit-low",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function SkillLevelBadge({ level, confidence = "medium", trend, sport, size = "md", className }: SkillLevelBadgeProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      {sport && <span>{sportConfig[sport].emoji}</span>}
      <span className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold border",
        confidenceColors[confidence],
        sizeClasses[size]
      )}>
        {levelLabels[level] || `L${level}`}
      </span>
      {trend && (
        <TrendIcon className={cn(
          "h-4 w-4",
          trend === "up" ? "text-credit-high" : trend === "down" ? "text-credit-low" : "text-muted-foreground"
        )} />
      )}
    </div>
  );
}

interface SkillLevelCardProps {
  skills: Array<{
    sport: SportType;
    level: number;
    confidence: "high" | "medium" | "low";
    trend?: "up" | "down" | "stable";
  }>;
  className?: string;
}

export function SkillLevelCard({ skills, className }: SkillLevelCardProps) {
  return (
    <div className={cn("p-4 rounded-xl border bg-card shadow-card", className)}>
      <h3 className="font-semibold text-foreground mb-3">運動等級</h3>
      <div className="space-y-2">
        {skills.map((skill) => (
          <div key={skill.sport} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary">
            <div className="flex items-center gap-2">
              <span className="text-lg">{sportConfig[skill.sport].emoji}</span>
              <span className="font-medium text-foreground">{sportConfig[skill.sport].label}</span>
            </div>
            <SkillLevelBadge 
              level={skill.level} 
              confidence={skill.confidence} 
              trend={skill.trend}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
