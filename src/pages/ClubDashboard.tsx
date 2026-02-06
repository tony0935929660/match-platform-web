import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { CreditBadge } from "@/components/ui/CreditBadge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { ClubInviteDialog } from "@/components/ClubInviteDialog";
import { ClubSettingsDialog } from "@/components/ClubSettingsDialog";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getGroups, getGroupMembers, getGroupPayments, GroupResponse, GroupMemberResponse, PaymentResponse } from "@/services/groupApi";
import { getMatches, MatchResponse } from "@/services/matchApi";
import { getPaymentTypes, PaymentTypeEnum } from "@/services/enumApi";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { 
  Plus,
  Settings,
  Users,
  DollarSign,
  Calendar,
  Trophy,
  Clock,
  MoreVertical,
  UserPlus,
  Download,
  CheckCircle,
  XCircle,
  ChevronRight,
  MapPin,
  QrCode
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const mockClub = {
  id: "1",
  name: "羽翔俱樂部",
  sport: "badminton" as SportType,
  members: 42,
  createdAt: "2023/03",
  description: "歡迎所有羽球愛好者！我們每週三、六固定練球，氣氛輕鬆友善。",
};

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
    isCasualOpen: true,
    status: "upcoming" as const,
  },
];

const mockMembers = [
  { id: "1", name: "王小明", level: 5, creditScore: 4.8, role: "admin", status: "active", paymentStatus: "paid" },
  { id: "2", name: "李大華", level: 4, creditScore: 4.5, role: "member", status: "active", paymentStatus: "paid" },
  { id: "3", name: "陳美玲", level: 4, creditScore: 4.2, role: "member", status: "active", paymentStatus: "pending" },
  { id: "4", name: "黃志強", level: 3, creditScore: 4.6, role: "member", status: "active", paymentStatus: "paid" },
];

const mockScores = [
  { id: "1", date: "2024/12/04", player1: "王小明", player2: "李大華", score1: 21, score2: 18 },
  { id: "2", date: "2024/12/04", player1: "陳美玲", player2: "黃志強", score1: 21, score2: 15 },
  { id: "3", date: "2024/12/04", player1: "林小芳", player2: "張明德", score1: 21, score2: 12 },
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

export default function ClubDashboard() {
  const { token } = useAuth();
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroups(token!),
    enabled: !!token,
  });

  const currentClub = groups?.[0];

  // Fetch members when we have a club
  const { data: members = [] } = useQuery<GroupMemberResponse[]>({
    queryKey: ['groupMembers', currentClub?.id],
    queryFn: () => getGroupMembers(token!, currentClub!.id),
    enabled: !!token && !!currentClub,
  });

  // Fetch payments when we have a club
  const { data: payments = [] } = useQuery<PaymentResponse[]>({
    queryKey: ['groupPayments', currentClub?.id],
    queryFn: () => getGroupPayments(token!, currentClub!.id),
    enabled: !!token && !!currentClub,
  });

  // Fetch payment types
  const { data: paymentTypes = [] } = useQuery<PaymentTypeEnum[]>({
    queryKey: ['paymentTypes'],
    queryFn: getPaymentTypes,
  });

  // Fetch upcoming activities
  const { data: upcomingActivitiesData } = useQuery({
    queryKey: ['upcomingMatches', currentClub?.id],
    queryFn: () => getMatches(token!, { 
      groupId: currentClub!.id, 
      pageSize: 10, // Fetch more to ensure we have enough upcoming after filtering
      pageNumber: 1
    }),
    enabled: !!token && !!currentClub,
  });

  const now = new Date();
  const upcomingActivities = (upcomingActivitiesData?.content || [])
    .filter(activity => new Date(activity.dateTime) > now)
    .slice(0, 3); // Take only top 3 upcoming
  
  const displayClub = currentClub ? {
    id: currentClub.id.toString(),
    name: currentClub.name,
    sport: getSportType(currentClub.sport),
    members: currentClub.memberCount,
    createdAt: format(new Date(currentClub.createdAt), "yyyy/MM"),
    description: currentClub.description
  } : mockClub;

  const [activeTab, setActiveTab] = useState("members");
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToTabsAndSwitch = (tab: string) => {
    setActiveTab(tab);
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Club Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">🏸</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{displayClub.name}</h1>
                <SportBadge sport={displayClub.sport} size="sm" />
              </div>
              <p className="text-muted-foreground">{displayClub.members} 成員 · 成立於 {displayClub.createdAt}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/club/new-activity">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                新增活動
              </Button>
            </Link>
            <ClubInviteDialog 
              clubId={displayClub.id} 
              clubName={displayClub.name}
              trigger={
                <Button variant="outline" className="gap-2">
                  <QrCode className="h-4 w-4" />
                  邀請成員
                </Button>
              }
            />
            {currentClub && (
              <ClubSettingsDialog 
                club={currentClub}
                trigger={
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/club/activities">
            <Card className="cursor-pointer hover:shadow-card-hover transition-all h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="font-semibold text-foreground">活動管理</div>
                <div className="text-sm text-muted-foreground">{upcomingActivitiesData?.totalElements || upcomingActivities.length} 場即將舉行</div>
              </CardContent>
            </Card>
          </Link>
          
          <Card 
            className="cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => scrollToTabsAndSwitch("members")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-semibold text-foreground">成員管理</div>
              <div className="text-sm text-muted-foreground">{displayClub.members} 位成員</div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => scrollToTabsAndSwitch("payments")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-semibold text-foreground">收款管理</div>
              <div className="text-sm text-muted-foreground">2 筆待確認</div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => scrollToTabsAndSwitch("scores")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-semibold text-foreground">計分紀錄</div>
              <div className="text-sm text-muted-foreground">本週 6 場比賽</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity List Preview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>即將舉行的活動</CardTitle>
              <Link to="/club/activities">
                <Button variant="outline" size="sm" className="gap-2">
                  查看全部
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <SportBadge sport={getSportType(activity.sport)} size="sm" />
                      {activity.isGuestPlayerAllowed && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          開放臨打
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">{activity.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(activity.dateTime), "MM/dd")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(activity.dateTime), "HH:mm")}-{format(new Date(activity.endDateTime), "HH:mm")}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
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
                        <DropdownMenuItem>臨打設定</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">取消活動</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div ref={tabsRef}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="members" className="gap-2">
                <Users className="h-4 w-4" />
                成員
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <DollarSign className="h-4 w-4" />
                收款
              </TabsTrigger>
              <TabsTrigger value="scores" className="gap-2">
                <Trophy className="h-4 w-4" />
                計分
              </TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>成員管理</CardTitle>
                    <div className="flex gap-2">
                      <Link to={`/club/members?groupId=${displayClub.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          查看全部
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <ClubInviteDialog 
                        clubId={displayClub.id} 
                        clubName={displayClub.name}
                        trigger={
                          <Button size="sm" className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            邀請成員
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        目前沒有成員
                      </div>
                    ) : (
                      members.slice(0, 5).map((member) => (
                        <div key={member.userId} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium text-primary">{member.userName[0]}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{member.userName}</span>
                                <Badge variant={member.role === 2 ? "default" : "secondary"}>
                                  {member.role === 2 ? "管理員" : "成員"}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {member.phone || member.email || "未提供聯絡資訊"}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>查看資料</DropdownMenuItem>
                              <DropdownMenuItem>調整權限</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">移除成員</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-foreground">$12,400</div>
                    <div className="text-sm text-muted-foreground">本季總收入</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-foreground">38</div>
                    <div className="text-sm text-muted-foreground">已繳費成員</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-warning">4</div>
                    <div className="text-sm text-muted-foreground">待繳費成員</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>收款紀錄</CardTitle>
                    <div className="flex gap-2">
                      <Link to={`/club/payments?groupId=${displayClub.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          查看全部
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">目前沒有繳費紀錄</div>
                  ) : (
                    <div className="space-y-3">
                      {payments.slice(0, 5).map((payment: PaymentResponse) => {
                        const paymentTypeName = paymentTypes.find(t => t.value === payment.paymentType)?.displayName || payment.paymentTypeName || "未知";
                        const formatDate = (dateString: string) => {
                          if (!dateString) return "";
                          const date = new Date(dateString);
                          return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
                        };
                        return (
                          <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{payment.userName}</div>
                              <div className="text-sm text-muted-foreground">{formatDate(payment.paymentDate)}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary">
                                {paymentTypeName}
                              </Badge>
                              <div className="text-right min-w-[80px]">
                                <div className="font-semibold">${payment.amount.toLocaleString()}</div>
                              </div>
                              {payment.status === 1 && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    確認
                                  </Button>
                                  <Button size="sm" variant="ghost" className="gap-1 text-destructive">
                                    <XCircle className="h-3 w-3" />
                                    拒絕
                                  </Button>
                                </div>
                              )}
                              {payment.status === 2 && (
                                <Badge variant="outline" className="text-primary border-primary">已確認</Badge>
                              )}
                              {payment.status === 0 && (
                                <Badge variant="destructive">未繳費</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scores Tab */}
            <TabsContent value="scores">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>計分紀錄</CardTitle>
                    <div className="flex gap-2">
                      <Link to="/club/scores">
                        <Button variant="outline" size="sm" className="gap-2">
                          查看全部
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        匯出
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        新增比賽
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockScores.map((score) => (
                      <div key={score.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                        <div className="text-sm text-muted-foreground">{score.date}</div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium text-foreground">{score.player1}</div>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background">
                            <span className={`text-xl font-bold ${score.score1 > score.score2 ? "text-primary" : "text-muted-foreground"}`}>
                              {score.score1}
                            </span>
                            <span className="text-muted-foreground">:</span>
                            <span className={`text-xl font-bold ${score.score2 > score.score1 ? "text-primary" : "text-muted-foreground"}`}>
                              {score.score2}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-foreground">{score.player2}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
