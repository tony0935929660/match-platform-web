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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useSearchParams } from "react-router-dom";


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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();
  
  const selectedClubId = searchParams.get("groupId") || "all";

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroups(token!),
    enabled: !!token,
  });

  const { data: matchesData } = useQuery({
    queryKey: ['clubMatches', selectedClubId],
    queryFn: () => getMatches(token!, { 
       groupId: selectedClubId === "all" ? undefined : Number(selectedClubId),
       pageNumber: 0, 
       pageSize: 50  // Fetch more
    }),
    enabled: !!token
  });
  
  // Filter matches locally if backend doesn't support groupId filter for "all" or specific
  // Assuming Backend supports groupId. If selectedClubId is "all", we might get all public matches or user's group matches depending on API.
  // Ideally API should support getting matches for *my* groups. 
  // If API getMatches without groupId returns all public matches, we might need to filter by groups user is in.
  // But for now let's convert group IDs to a Set for checking.
  const myGroupIds = new Set(groups?.map(g => g.id));
  
  const allMatches = matchesData?.content || [];
  
  // If "all" is selected, we only want to show matches from *my* clubs, not global public matches?
  // Current requirement: "分不同球團" (Separate different clubs)
  // Maybe user wants a dropdown to select club?

  const displayedMatches = allMatches.filter(m => {
      // If a specific club is selected, API likely handled it, but double check
      if (selectedClubId !== "all" && m.groupId?.toString() !== selectedClubId) return false;
      
      // If "all" selected, show only matches from my groups
      if (selectedClubId === "all" && m.groupId && !myGroupIds.has(m.groupId)) return false; 
      
      return true;
  });

  const now = new Date();

  const filteredUpcoming = displayedMatches.filter(activity => {
    const isUpcoming = new Date(activity.dateTime) > now;
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          activity.court.toLowerCase().includes(searchQuery.toLowerCase());
    return isUpcoming && matchesSearch;
  });

  const filteredPast = displayedMatches.filter(activity => {
    const isPast = new Date(activity.dateTime) <= now;
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          activity.court.toLowerCase().includes(searchQuery.toLowerCase());
    return isPast && matchesSearch;
  });


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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="搜尋活動名稱、地點..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full md:w-64">
            <Select 
                value={selectedClubId} 
                onValueChange={(val) => {
                  setSearchParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    if (val === "all") newParams.delete("groupId");
                    else newParams.set("groupId", val);
                    return newParams;
                  });
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="選擇球團" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">所有球團</SelectItem>
                    {groups?.map((group) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics or Group Name Header if filtered */}
        {selectedClubId !== "all" && (
            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    {groups?.find(g => g.id.toString() === selectedClubId)?.name || "未知球團"} 的活動
                </h2>
            </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{filteredUpcoming.length}</div>
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
                {displayedMatches.reduce((sum, a) => sum + (a.participants?.length || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">總報名人數</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {displayedMatches.filter(a => a.isGuestPlayerAllowed).length}
              </div>
              <div className="text-sm text-muted-foreground">開放臨打</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">即將舉行 ({filteredUpcoming.length})</TabsTrigger>
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
            <Badge variant="outline">{activity.groupName || `球團 #${activity.groupId}`}</Badge>
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
              <DropdownMenuItem>
                <Link to={`/club/activities/${activity.id}/edit`}>編輯活動</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/club/activities/${activity.id}/participants`}>管理報名</Link>
              </DropdownMenuItem>
              {!isPast && <DropdownMenuItem className="text-destructive">取消活動</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
