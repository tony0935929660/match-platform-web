import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  Plus, 
  ChevronRight, 
  Trophy, 
  MapPin,
  Calendar
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getGroups, GroupResponse } from "@/services/groupApi";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

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

export default function ClubList() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data: groups = [], isLoading } = useQuery<GroupResponse[]>({
    queryKey: ['groups'],
    queryFn: () => getGroups(token!),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">我的球團</h1>
            <p className="text-muted-foreground mt-1">
              管理您加入或建立的球團
            </p>
          </div>
          <Link to="/club/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              建立新球團
            </Button>
          </Link>
        </div>

        {/* Club List */}
        {groups.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">尚無球團</h3>
            <p className="mb-6">您目前還沒有加入任何球團，立即建立或加入一個吧！</p>
            <div className="flex justify-center gap-4">
              <Link to="/club/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  建立球團
                </Button>
              </Link>
              {/* This might be a search page later */}
              {/* <Button variant="outline">搜尋球團</Button> */}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Link key={group.id} to={`/club/dashboard?groupId=${group.id}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-transparent hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <SportBadge sport={getSportType(group.sport)} />
                      <Badge variant={group.myRole === 2 ? "default" : "secondary"}>
                        {group.myRole === 2 ? "管理員" : "成員"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {group.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {group.description || "尚無簡介"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{group.memberCount} 位成員</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>成立於 {format(new Date(group.createdAt), "yyyy/MM")}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 text-primary text-sm font-medium flex items-center">
                    進入球團
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
