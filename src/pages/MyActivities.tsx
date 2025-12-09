import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const myCreatedActivities = [
  {
    id: "1",
    title: "週三羽球交流賽",
    sport: "badminton" as SportType,
    date: "12/11 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    currentSlots: 6,
    maxSlots: 8,
    casualSlots: 2,
    isCasualOpen: true,
    status: "upcoming" as const,
  },
  {
    id: "2",
    title: "週六羽球雙打",
    sport: "badminton" as SportType,
    date: "12/14 (六)",
    time: "15:00-18:00",
    location: "台北市中山運動中心",
    currentSlots: 4,
    maxSlots: 4,
    casualSlots: 0,
    isCasualOpen: false,
    status: "upcoming" as const,
  },
];

const myJoinedActivities = [
  {
    id: "3",
    title: "籃球3v3鬥牛",
    sport: "basketball" as SportType,
    date: "12/12 (四)",
    time: "18:30-20:30",
    location: "台北市信義運動中心",
    hostName: "陳志強",
    status: "confirmed" as const,
  },
  {
    id: "4",
    title: "排球練習團",
    sport: "volleyball" as SportType,
    date: "12/15 (日)",
    time: "14:00-17:00",
    location: "台中市北區體育館",
    hostName: "林美玲",
    status: "waitlist" as const,
    waitlistPosition: 2,
  },
];

const myHistoryActivities = [
  {
    id: "5",
    title: "週三羽球交流賽",
    sport: "badminton" as SportType,
    date: "12/04 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    hostName: "王小明",
    attended: true,
    rated: false,
  },
  {
    id: "6",
    title: "網球友誼賽",
    sport: "tennis" as SportType,
    date: "12/01 (日)",
    time: "09:00-12:00",
    location: "新北市板橋網球場",
    hostName: "李大華",
    attended: true,
    rated: true,
  },
];

export default function MyActivities() {
  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">我的活動</h1>
          <p className="text-muted-foreground mt-1">管理你參與的所有活動</p>
        </div>
        <Tabs defaultValue="created" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="created" className="gap-2">
              我開的團
              <Badge variant="secondary" className="ml-1">{myCreatedActivities.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="joined" className="gap-2">
              我報名的
              <Badge variant="secondary" className="ml-1">{myJoinedActivities.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              歷史活動
              <Badge variant="secondary" className="ml-1">{myHistoryActivities.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Created Activities */}
          <TabsContent value="created" className="space-y-4">
            {myCreatedActivities.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">還沒有開過團</h3>
                <p className="text-muted-foreground mb-4">開始你的第一個活動吧！</p>
                <Link to="/club/new-activity">
                  <Button>開新活動</Button>
                </Link>
              </div>
            ) : (
              myCreatedActivities.map((activity) => (
                <div key={activity.id} className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SportBadge sport={activity.sport} size="sm" />
                        {activity.isCasualOpen && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            開放臨打
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{activity.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {activity.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {activity.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {activity.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">
                            {activity.currentSlots}/{activity.maxSlots}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.maxSlots - activity.currentSlots > 0 
                            ? `剩餘 ${activity.maxSlots - activity.currentSlots} 位`
                            : "已額滿"
                          }
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>編輯活動</DropdownMenuItem>
                          <DropdownMenuItem>管理報名</DropdownMenuItem>
                          <DropdownMenuItem>臨打設定</DropdownMenuItem>
                          <DropdownMenuItem>候補管理</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">取消活動</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Joined Activities */}
          <TabsContent value="joined" className="space-y-4">
            {myJoinedActivities.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">還沒有報名活動</h3>
                <p className="text-muted-foreground mb-4">探索附近的運動揪團吧！</p>
                <Link to="/activities">
                  <Button>找活動</Button>
                </Link>
              </div>
            ) : (
              myJoinedActivities.map((activity) => (
                <div key={activity.id} className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SportBadge sport={activity.sport} size="sm" />
                        {activity.status === "confirmed" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <CheckCircle className="h-3 w-3" />
                            已確認
                          </span>
                        )}
                        {activity.status === "waitlist" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                            <AlertCircle className="h-3 w-3" />
                            候補 #{activity.waitlistPosition}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">{activity.title}</h3>
                      <div className="text-sm text-muted-foreground mb-2">主揪：{activity.hostName}</div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {activity.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {activity.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {activity.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">查看詳情</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        取消報名
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* History Activities */}
          <TabsContent value="history" className="space-y-4">
            {myHistoryActivities.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">還沒有歷史活動</h3>
                <p className="text-muted-foreground">參加活動後會顯示在這裡</p>
              </div>
            ) : (
              myHistoryActivities.map((activity) => (
                <div key={activity.id} className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SportBadge sport={activity.sport} size="sm" />
                        {activity.attended ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <CheckCircle className="h-3 w-3" />
                            已出席
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            <XCircle className="h-3 w-3" />
                            未出席
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">{activity.title}</h3>
                      <div className="text-sm text-muted-foreground mb-2">主揪：{activity.hostName}</div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {activity.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {activity.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {activity.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!activity.rated && activity.attended && (
                        <Button size="sm">評價活動</Button>
                      )}
                      {activity.rated && (
                        <span className="text-sm text-muted-foreground">已評價</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
