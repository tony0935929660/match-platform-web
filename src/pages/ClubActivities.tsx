import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getGroups } from "@/services/groupApi";
import { getMatches, MatchResponse } from "@/services/matchApi";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  MoreVertical,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

const mockClubActivities = [
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
  {
    id: "3",
    title: "週三羽球練習",
    sport: "badminton" as SportType,
    date: "12/18 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    currentSlots: 3,
    maxSlots: 8,
    casualSlots: 2,
    isCasualOpen: true,
    status: "upcoming" as const,
  },
];

const mockPastActivities = [
  {
    id: "4",
    title: "週三羽球交流賽",
    sport: "badminton" as SportType,
    date: "12/04 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    currentSlots: 8,
    maxSlots: 8,
    status: "completed" as const,
  },
  {
    id: "5",
    title: "週六羽球雙打",
    sport: "badminton" as SportType,
    date: "11/30 (六)",
    time: "15:00-18:00",
    location: "台北市中山運動中心",
    currentSlots: 4,
    maxSlots: 4,
    status: "completed" as const,
  },
];

const getSportType = (id: number): SportType => {
  switch (id) {
    case 1: return "badminton";
    case 2: return "tennis";
    case 3: return "table-tennis";
    case 4: return "basketball";
    case 5: return "volleyball";
    case 6: return "soccer";
    default: return "badminton";
  }
};

export default function ClubActivities() {
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();
  
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroups(token!),
    enabled: !!token,
  });
  const currentClub = groups?.[0];

  const { data: matchesData } = useQuery({
    queryKey: ['clubMatches', currentClub?.id],
    queryFn: () => getMatches(token!, { groupId: currentClub!.id, pageNumber: 1, pageSize: 10 }),
    enabled: !!token && !!currentClub
  });

  const matches = matchesData?.content || [];
  
  // 簡單過濾 (如果需要前端過濾) - 此處使用 API 回傳資料取代 mock
  const filteredUpcoming = matches.filter(activity => 
    activity.name.includes(searchQuery) || activity.court.includes(searchQuery)
  );

  // 暫時隱藏歷史活動直到 API 支援
  const filteredPast: MatchResponse[] = [];

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/club">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">活動管理</h1>
            <p className="text-muted-foreground mt-1">管理球團所有活動</p>
          </div>
          <Link to="/club/new-activity">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新增活動
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{matchesData?.totalElements || matches.length}</div>
              <div className="text-sm text-muted-foreground">即將舉行</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{filteredPast.length}</div>
              <div className="text-sm text-muted-foreground">已結束</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {matches.reduce((sum, a) => sum + (a.participants?.length || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">總報名人數</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {matches.filter(a => a.isGuestPlayerAllowed).length}
              </div>
              <div className="text-sm text-muted-foreground">開放臨打</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋活動..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            篩選
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">即將舉行 ({matches.length})</TabsTrigger>
            <TabsTrigger value="past">歷史活動 ({filteredPast.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredUpcoming.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {filteredPast.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} isPast />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

interface ActivityItemProps {
  activity: MatchResponse;
  isPast?: boolean;
}

function ActivityItem({ activity, isPast = false }: ActivityItemProps) {
  return (
    <div className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <SportBadge sport={getSportType(activity.sport)} size="sm" />
            {activity.isGuestPlayerAllowed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                開放臨打
              </span>
            )}
            {isPast && (
              <Badge variant="secondary">已結束</Badge>
            )}
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-2">{activity.name}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(activity.dateTime), "yyyy/MM/dd")}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {format(new Date(activity.dateTime), "HH:mm")}-{format(new Date(activity.endDateTime), "HH:mm")}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {activity.court}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {activity.participants?.length || 0}
                {activity.requiredPeople ? `/${activity.requiredPeople}` : " 人"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {!activity.requiredPeople
                ? "無名額限制"
                : activity.requiredPeople - (activity.participants?.length || 0) > 0 
                  ? `剩餘 ${activity.requiredPeople - (activity.participants?.length || 0)} 位`
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
              {!isPast && <DropdownMenuItem>臨打設定</DropdownMenuItem>}
              {!isPast && <DropdownMenuItem>候補管理</DropdownMenuItem>}
              {!isPast && <DropdownMenuItem className="text-destructive">取消活動</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
