import { cn } from "@/lib/utils";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CreditBadgeProps {
  score: number; // 1-5
  confidence: "high" | "medium" | "low";
  trend?: "up" | "down" | "stable";
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const confidenceConfig = {
  high: { label: "高", color: "text-credit-high", bg: "bg-credit-high/10" },
  medium: { label: "中", color: "text-credit-medium", bg: "bg-credit-medium/10" },
  low: { label: "低", color: "text-credit-low", bg: "bg-credit-low/10" },
};

const sizeConfig = {
  sm: { wrapper: "gap-1", star: "h-3 w-3", text: "text-xs" },
  md: { wrapper: "gap-1.5", star: "h-4 w-4", text: "text-sm" },
  lg: { wrapper: "gap-2", star: "h-5 w-5", text: "text-base" },
};

export function CreditBadge({ score, confidence, trend, showDetails = false, size = "md", className }: CreditBadgeProps) {
  const conf = confidenceConfig[confidence];
  const sizeClass = sizeConfig[size];
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  return (
    <div className={cn("inline-flex items-center", sizeClass.wrapper, className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClass.star,
              i < score ? "fill-primary text-primary" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      {showDetails && (
        <>
          <span className={cn("font-medium", sizeClass.text)}>{score.toFixed(1)}</span>
          <span className={cn("px-1.5 py-0.5 rounded-full font-medium", conf.bg, conf.color, sizeClass.text)}>
            信心{conf.label}
          </span>
          {trend && (
            <TrendIcon className={cn(
              sizeClass.star,
              trend === "up" ? "text-credit-high" : trend === "down" ? "text-credit-low" : "text-muted-foreground"
            )} />
          )}
        </>
      )}
    </div>
  );
}

interface CreditCardProps {
  score: number;
  confidence: "high" | "medium" | "low";
  attendanceRate: number;
  cancelRate: number;
  absenceCount: number;
  className?: string;
}

export function CreditCard({ score, confidence, attendanceRate, cancelRate, absenceCount, className }: CreditCardProps) {
  const conf = confidenceConfig[confidence];
  
  return (
    <div className={cn("p-4 rounded-xl border bg-card shadow-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">信用評分</h3>
        <CreditBadge score={score} confidence={confidence} showDetails size="md" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-lg bg-secondary">
          <div className="text-2xl font-bold text-foreground">{attendanceRate}%</div>
          <div className="text-xs text-muted-foreground mt-1">出席率</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary">
          <div className="text-2xl font-bold text-foreground">{cancelRate}%</div>
          <div className="text-xs text-muted-foreground mt-1">取消率</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary">
          <div className={cn("text-2xl font-bold", absenceCount > 2 ? "text-destructive" : "text-foreground")}>
            {absenceCount}
          </div>
          <div className="text-xs text-muted-foreground mt-1">缺席次數</div>
        </div>
      </div>
    </div>
  );
}
