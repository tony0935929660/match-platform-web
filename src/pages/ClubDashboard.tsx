import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { CreditBadge } from "@/components/ui/CreditBadge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { 
  Plus,
  Settings,
  Users,
  DollarSign,
  Calendar,
  Trophy,
  Clock,
  MoreVertical,
  Edit,
  UserPlus,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight
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
import { toast } from "@/hooks/use-toast";

const mockClub = {
  id: "1",
  name: "羽翔俱樂部",
  sport: "badminton" as SportType,
  members: 42,
  createdAt: "2023/03",
  description: "歡迎所有羽球愛好者！我們每週三、六固定練球，氣氛輕鬆友善。",
};

const mockMembers = [
  { id: "1", name: "王小明", level: 5, creditScore: 4.8, role: "admin", status: "active", paymentStatus: "paid" },
  { id: "2", name: "李大華", level: 4, creditScore: 4.5, role: "member", status: "active", paymentStatus: "paid" },
  { id: "3", name: "陳美玲", level: 4, creditScore: 4.2, role: "member", status: "active", paymentStatus: "pending" },
  { id: "4", name: "黃志強", level: 3, creditScore: 4.6, role: "member", status: "active", paymentStatus: "paid" },
  { id: "5", name: "林小芳", level: 5, creditScore: 4.9, role: "member", status: "active", paymentStatus: "paid" },
  { id: "6", name: "張明德", level: 3, creditScore: 3.8, role: "casual", status: "active", paymentStatus: "unpaid" },
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
  const [isCasualOpen, setIsCasualOpen] = useState(true);
  const [isScoringMode, setIsScoringMode] = useState(false);
  const [casualSlots, setCasualSlots] = useState(2);
  const [casualFee, setCasualFee] = useState(180);

  const handleToggleCasual = (checked: boolean) => {
    setIsCasualOpen(checked);
    toast({
      title: checked ? "已開放臨打" : "已關閉臨打",
      description: checked ? "現在其他球友可以報名臨打了" : "臨打功能已關閉",
    });
  };

  const handleToggleScoring = (checked: boolean) => {
    setIsScoringMode(checked);
    toast({
      title: checked ? "已開啟計分模式" : "已關閉計分模式",
      description: checked ? "可以開始記錄比賽分數了" : "計分模式已關閉",
    });
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
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-card-hover transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-semibold text-foreground">活動管理</div>
              <div className="text-sm text-muted-foreground">3 場即將舉行</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-card-hover transition-all">
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
          
          <Card className="cursor-pointer hover:shadow-card-hover transition-all">
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
          
          <Card className="cursor-pointer hover:shadow-card-hover transition-all">
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

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Casual Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">臨打設定</CardTitle>
                  <CardDescription>管理臨打開放與費用</CardDescription>
                </div>
                <Switch checked={isCasualOpen} onCheckedChange={handleToggleCasual} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                <span className={`w-2 h-2 rounded-full ${isCasualOpen ? "bg-primary" : "bg-muted-foreground"}`} />
                <span className="text-sm font-medium">
                  {isCasualOpen ? "🟢 開放臨打" : "🔴 不開放臨打"}
                </span>
              </div>
              
              {isCasualOpen && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="casualSlots">臨打名額</Label>
                    <Input
                      id="casualSlots"
                      type="number"
                      value={casualSlots}
                      onChange={(e) => setCasualSlots(Number(e.target.value))}
                      min={0}
                      max={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="casualFee">臨打費用</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="casualFee"
                        type="number"
                        value={casualFee}
                        onChange={(e) => setCasualFee(Number(e.target.value))}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Scoring Mode */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">計分模式</CardTitle>
                  <CardDescription>記錄比賽分數與統計</CardDescription>
                </div>
                <Switch checked={isScoringMode} onCheckedChange={handleToggleScoring} />
              </div>
            </CardHeader>
            <CardContent>
              {isScoringMode ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary text-sm">
                    <Trophy className="h-4 w-4 inline-block mr-2" />
                    計分模式已開啟
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    新增比賽結果
                  </Button>
                  <Button variant="ghost" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    匯出 CSV
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>開啟計分模式以記錄比賽分數</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-6">
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
                  <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    邀請成員
                  </Button>
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
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    新增季繳方案
                  </Button>
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
    </MainLayout>
  );
}
