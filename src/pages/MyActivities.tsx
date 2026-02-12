import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserMatches } from "@/services/userApi";
import { MatchResponse } from "@/services/matchApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mapping for sport ID to SportBadge type
const sportValueToType: Record<number, SportType> = {
  1: "badminton",
  2: "tennis",
  3: "basketball",
  4: "volleyball",
  5: "table-tennis",
  6: "soccer",
};

const ITEMS_PER_PAGE = 10;

export default function MyActivities() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "created";
  
  const [pagination, setPagination] = useState({
    created: 1,
    joined: 1,
    history: 1
  });

  // Load user matches
  const { data: userMatchesData, isLoading: isLoadingMatches } = useQuery({
    queryKey: ['userMatches'],
    queryFn: () => getUserMatches(token!, { pageSize: 100 }),
    enabled: !!token
  });

  const allMatches = userMatchesData?.data || [];
  const now = new Date();

  const hostedMatches = allMatches.filter(m => m.userRole === 1 && new Date(m.endDateTime) >= now);
  const joinedMatches = allMatches.filter(m => (m.userRole === 2 || m.userRole === 3) && new Date(m.endDateTime) >= now);
  const historyMatches = allMatches.filter(m => new Date(m.endDateTime) < now);

  const getPaginatedList = (list: MatchResponse[], tab: "created" | "joined" | "history") => {
    const page = pagination[tab];
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return {
      visibleList: list.slice(startIndex, endIndex),
      totalPages: Math.ceil(list.length / ITEMS_PER_PAGE),
      currentPage: page
    };
  };

  const handlePageChange = (tab: "created" | "joined" | "history", page: number) => {
    setPagination(prev => ({ ...prev, [tab]: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = (tab: "created" | "joined" | "history", totalPages: number, currentPage: number) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex flex-col items-center gap-4 mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(tab, Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(tab, page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(tab, Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
            <Link to="/profile">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </Link>
            <h1 className="text-2xl font-bold">我的活動紀錄</h1>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="created">我開的團 ({hostedMatches.length})</TabsTrigger>
            <TabsTrigger value="joined">已報名 ({joinedMatches.length})</TabsTrigger>
            <TabsTrigger value="history">歷史活動 ({historyMatches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="space-y-4">
            {hostedMatches.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎾</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">還沒有舉辦活動</h3>
                <Link to="/activities/new">
                  <Button>舉辦活動</Button>
                </Link>
              </div>
            ) : (
              <>
                {getPaginatedList(hostedMatches, "created").visibleList.map((activity) => (
                  <div key={activity.id} className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <SportBadge sport={sportValueToType[activity.sport] || "badminton"} size="sm" />
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <CheckCircle className="h-3 w-3" />
                            已發布
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">{activity.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(activity.dateTime), "MM/dd (eee)", { locale: zhTW })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {format(new Date(activity.dateTime), "HH:mm")} - {format(new Date(activity.endDateTime), "HH:mm")}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {activity.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-semibold text-foreground">
                            {activity.participants?.length || 0}/{activity.requiredPeople || "?"}
                          </span>
                        </div>
                        <Link to={`/activities/${activity.id}`}>
                           <Button variant="outline" size="sm">查看詳情</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {renderPagination("created", getPaginatedList(hostedMatches, "created").totalPages, getPaginatedList(hostedMatches, "created").currentPage)}
              </>
            )}
          </TabsContent>

          <TabsContent value="joined" className="space-y-4">
            {joinedMatches.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">還沒有報名活動</h3>
                <Link to="/activities">
                  <Button>找活動</Button>
                </Link>
              </div>
            ) : (
              <>
                {getPaginatedList(joinedMatches, "joined").visibleList.map((activity) => (
                  <div key={activity.id} className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <SportBadge sport={sportValueToType[activity.sport] || "badminton"} size="sm" />
                          {activity.userRole === 3 ? (
                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">候補</span>
                          ) : (
                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">已確認</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">{activity.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(activity.dateTime), "MM/dd (eee)", { locale: zhTW })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {format(new Date(activity.dateTime), "HH:mm")} - {format(new Date(activity.endDateTime), "HH:mm")}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {activity.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/activities/${activity.id}`}>
                          <Button variant="outline" size="sm">查看詳情</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {renderPagination("joined", getPaginatedList(joinedMatches, "joined").totalPages, getPaginatedList(joinedMatches, "joined").currentPage)}
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {historyMatches.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">還沒有歷史活動</h3>
              </div>
            ) : (
              <>
                {getPaginatedList(historyMatches, "history").visibleList.map((activity) => (
                  <div key={activity.id} className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <SportBadge sport={sportValueToType[activity.sport] || "badminton"} size="sm" />
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">已結束</span>
                        </div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">{activity.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(activity.dateTime), "yyyy/MM/dd", { locale: zhTW })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {format(new Date(activity.dateTime), "HH:mm")} - {format(new Date(activity.endDateTime), "HH:mm")}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {activity.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                          <Link to={`/activities/${activity.id}`}>
                              <Button size="sm" variant="outline">查看詳情</Button>
                          </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {renderPagination("history", getPaginatedList(historyMatches, "history").totalPages, getPaginatedList(historyMatches, "history").currentPage)}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}