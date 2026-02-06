import { cn } from "@/lib/utils";
import { MapPin, Clock, Users, Star, CheckCircle } from "lucide-react";
import { SportBadge, SportType } from "./SportBadge";
import { SkillLevelBadge } from "./SkillLevelBadge";
import { Button } from "./button";
import { Link } from "react-router-dom";

interface ActivityCardProps {
  id: string;
  title: string;
  sport: SportType;
  date: string;
  time: string;
  location: string;
  hostName: string;
  hostAvatar?: string;
  hostCreditScore: number;
  hostConfidence: "high" | "medium" | "low";
  levelRange: { min: number; max: number };
  isCasualOpen: boolean;
  currentSlots: number;
  maxSlots: number | null;
  waitlistCount?: number;
  price?: number;
  className?: string;
}

export function ActivityCard({
  id,
  title,
  sport,
  date,
  time,
  location,
  hostName,
  hostAvatar,
  hostCreditScore,
  hostConfidence,
  levelRange,
  isCasualOpen,
  currentSlots,
  maxSlots,
  waitlistCount,
  price,
  className,
}: ActivityCardProps) {
  const isFull = maxSlots !== null && currentSlots >= maxSlots;
  const slotsRemaining = maxSlots !== null ? maxSlots - currentSlots : 9999;
  
  return (
    <Link to={`/activities/${id}`} className="block group">
      <div className={cn(
        "p-4 rounded-xl border bg-card shadow-card transition-all duration-300",
        "hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-1",
        className
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <SportBadge sport={sport} size="sm" />
              {isCasualOpen && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
                  開放臨打
                </span>
              )}
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
          </div>
          {price && (
            <div className="text-right">
              <div className="text-lg font-bold text-primary">${price}</div>
              <div className="text-xs text-muted-foreground">/ 人</div>
            </div>
          )}
        </div>
        
        {/* Info Grid */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{date} {time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        
        {/* Level & Host */}
        <div className="flex items-center justify-between py-3 border-t border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">等級</span>
            <div className="flex items-center gap-1">
              <SkillLevelBadge level={levelRange.min} confidence="medium" size="sm" />
              <span className="text-muted-foreground">-</span>
              <SkillLevelBadge level={levelRange.max} confidence="medium" size="sm" />
            </div>
          </div>
        </div>
        
        {/* Host Info */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {hostAvatar ? (
                <img src={hostAvatar} alt={hostName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-primary">{hostName[0]}</span>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{hostName}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span>{hostCreditScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Slots */}
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className={cn(
                "font-semibold",
                isFull ? "text-destructive" : (maxSlots !== null && slotsRemaining <= 2) ? "text-warning" : "text-foreground"
              )}>
                {currentSlots}{maxSlots !== null ? `/${maxSlots}` : " 人"}
              </span>
            </div>
            {isFull && waitlistCount ? (
              <div className="text-xs text-muted-foreground">候補 {waitlistCount} 人</div>
            ) : maxSlots === null ? (
              <div className="text-xs text-muted-foreground">無名額限制</div>
            ) : slotsRemaining > 0 ? (
              <div className="text-xs text-muted-foreground">剩餘 {slotsRemaining} 位</div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface WaitlistCardProps {
  position: number;
  userName: string;
  userAvatar?: string;
  joinedAt: string;
  className?: string;
}

export function WaitlistCard({ position, userName, userAvatar, joinedAt, className }: WaitlistCardProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg bg-secondary border border-border",
      className
    )}>
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
        #{position}
      </div>
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
        {userAvatar ? (
          <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-medium text-primary">{userName[0]}</span>
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium text-foreground">{userName}</div>
        <div className="text-xs text-muted-foreground">{joinedAt}</div>
      </div>
    </div>
  );
}
