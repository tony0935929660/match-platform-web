import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { CreditBadge } from "@/components/ui/CreditBadge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { ClubInviteDialog } from "@/components/ClubInviteDialog";
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

const mockPayments = [
  { id: "1", userName: "陳美玲", type: "single", amount: 150, date: "2024/12/09", status: "pending", proof: true },
  { id: "2", userName: "張明德", type: "single", amount: 180, date: "2024/12/09", status: "unpaid", proof: false },
  { id: "3", userName: "李大華", type: "season", amount: 2400, date: "2024/11/01", status: "paid", proof: true },
];

const mockScores = [
  { id: "1", date: "2024/12/04", player1: "王小明", player2: "李大華", score1: 21, score2: 18 },
  { id: "2", date: "2024/12/04", player1: "陳美玲", player2: "黃志強", score1: 21, score2: 15 },
  { id: "3", date: "2024/12/04", player1: "林小芳", player2: "張明德", score1: 21, score2: 12 },
];

export default function ClubDashboard() {
  const [activeTab, setActiveTab] = useState("members");
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToTabsAndSwitch = (tab: string) => {
    setActiveTab(tab);
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{mockClub.name}</h1>
                <SportBadge sport={mockClub.sport} size="sm" />
              </div>
              <p className="text-muted-foreground">{mockClub.members} 成員 · 成立於 {mockClub.createdAt}</p>
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
              clubId={mockClub.id} 
              clubName={mockClub.name}
              trigger={
                <Button variant="outline" className="gap-2">
                  <QrCode className="h-4 w-4" />
                  邀請成員
                </Button>
              }
            />
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
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
                <div className="text-sm text-muted-foreground">{mockClubActivities.length} 場即將舉行</div>
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
              <div className="text-sm text-muted-foreground">{mockClub.members} 位成員</div>
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
              {mockClubActivities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <SportBadge sport={activity.sport} size="sm" />
                      {activity.isCasualOpen && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          開放臨打
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">{activity.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {activity.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {activity.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
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
                      <Link to="/club/members">
                        <Button variant="outline" size="sm" className="gap-2">
                          查看全部
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button size="sm" className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        邀請成員
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">{member.name[0]}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{member.name}</span>
                              <Badge variant={member.role === "admin" ? "default" : member.role === "casual" ? "outline" : "secondary"}>
                                {member.role === "admin" ? "管理員" : member.role === "casual" ? "臨打" : "成員"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <SkillLevelBadge level={member.level} size="sm" />
                              <CreditBadge score={member.creditScore} confidence="high" size="sm" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.paymentStatus === "paid" ? "default" : member.paymentStatus === "pending" ? "secondary" : "destructive"}>
                            {member.paymentStatus === "paid" ? "已繳費" : member.paymentStatus === "pending" ? "待確認" : "未繳費"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>查看資料</DropdownMenuItem>
                              <DropdownMenuItem>調整權限</DropdownMenuItem>
                              <DropdownMenuItem>調整費率</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">移除成員</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
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
                      <Link to="/club/payments">
                        <Button variant="outline" size="sm" className="gap-2">
                          查看全部
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        新增季繳方案
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{payment.userName}</div>
                          <div className="text-sm text-muted-foreground">{payment.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={payment.type === "season" ? "default" : "secondary"}>
                            {payment.type === "season" ? "季繳" : "單次"}
                          </Badge>
                          <div className="text-right min-w-[80px]">
                            <div className="font-semibold">${payment.amount}</div>
                          </div>
                          {payment.status === "pending" && (
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
                          {payment.status === "paid" && (
                            <Badge variant="outline" className="text-primary border-primary">已確認</Badge>
                          )}
                          {payment.status === "unpaid" && (
                            <Badge variant="destructive">未繳費</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
