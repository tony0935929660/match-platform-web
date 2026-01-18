import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
// import { CreditCard } from "@/components/ui/CreditBadge";
// import { SkillLevelCard } from "@/components/ui/SkillLevelBadge";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Settings,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Loader2,
  MapPin,
  Users,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile, UserProfile, UpdateUserRequest } from "@/services/userApi";
import { useState, useEffect } from "react";

const mockPaymentHistory = [
  { id: "1", date: "2024/12/04", activity: "週三羽球交流賽", amount: 150, type: "single", status: "paid" },
  { id: "2", date: "2024/12/01", activity: "網球友誼賽", amount: 200, type: "single", status: "paid" },
  { id: "3", date: "2024/11/27", activity: "羽翔俱樂部 - 季繳", amount: 2400, type: "season", status: "paid" },
  { id: "4", date: "2024/11/20", activity: "籃球3v3鬥牛", amount: 100, type: "single", status: "paid" },
];

const mockActivityTrend = [
  { month: "7月", count: 4 },
  { month: "8月", count: 6 },
  { month: "9月", count: 5 },
  { month: "10月", count: 8 },
  { month: "11月", count: 7 },
  { month: "12月", count: 6 },
];

// const mockSkills = [
//   { sport: "badminton" as SportType, level: 5, confidence: "high" as const, trend: "up" as const },
//   { sport: "tennis" as SportType, level: 3, confidence: "medium" as const, trend: "stable" as const },
//   { sport: "basketball" as SportType, level: 4, confidence: "high" as const, trend: "up" as const },
// ];

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

export default function Profile() {
  const { token, user: authUser, setUser: setAuthUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 編輯 Dialog 狀態
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserRequest>({
    name: "",
    phone: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // 載入使用者資料
  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setError("請先登入");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUserProfile(token);
        setProfile(data);
        setEditForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(err instanceof Error ? err.message : "載入失敗");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  // 開啟編輯 Dialog
  const handleOpenEdit = () => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
    setIsEditOpen(true);
  };

  // 儲存變更
  const handleSave = async () => {
    if (!token) return;

    setIsSaving(true);
    try {
      const updatedProfile = await updateUserProfile(token, editForm);
      setProfile(updatedProfile);
      
      // 同步更新 AuthContext 中的使用者資料
      if (authUser) {
        setAuthUser({
          ...authUser,
          displayName: updatedProfile.name,
          email: updatedProfile.email || undefined,
        });
      }
      
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err instanceof Error ? err.message : "更新失敗");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-6 md:py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="container py-6 md:py-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <p className="text-muted-foreground">{error || "無法載入使用者資料"}</p>
          <Link to="/login">
            <Button>前往登入</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
  }).replace(/\//g, "/");

  // Mock data for display (這些資料之後可以從其他 API 取得)
  const mockStats = {
    totalActivities: 48,
    hostedActivities: 12,
    thisMonth: 6,
  };

  const mockCredit = {
    score: 4.8,
    confidence: "high" as const,
    attendanceRate: 95,
    cancelRate: 3,
    absenceCount: 1,
  };

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold text-primary">{profile.name[0]}</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.email || "未設定 Email"}</p>
              <p className="text-sm text-muted-foreground">{profile.phone || "未設定電話"}</p>
              <p className="text-sm text-muted-foreground mt-1">會員自 {memberSince}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleOpenEdit}>
              <Edit className="h-4 w-4" />
              編輯資料
            </Button>
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 md:p-6 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">總活動數</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{mockStats.totalActivities}</div>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">已開團</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{mockStats.hostedActivities}</div>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">本月活動</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{mockStats.thisMonth}</div>
          </div>
        </div>

        {/* Credit Card - 暫時註解 */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CreditCard
            score={mockCredit.score}
            confidence={mockCredit.confidence}
            attendanceRate={mockCredit.attendanceRate}
            cancelRate={mockCredit.cancelRate}
            absenceCount={mockCredit.absenceCount}
          />
          <SkillLevelCard skills={mockSkills} />
        </div> */}

        {/* My Activities Tabs */}
        <Tabs defaultValue="created" className="space-y-6 mb-8">
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

        {/* Payment & Trend Tabs */}
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="payments" className="gap-2">
              <DollarSign className="h-4 w-4" />
              繳費紀錄
            </TabsTrigger>
            <TabsTrigger value="trend" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              參與趨勢
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="p-4 border-b bg-secondary/30">
                <h3 className="font-semibold text-foreground">繳費紀錄</h3>
              </div>
              <div className="divide-y">
                {mockPaymentHistory.map((payment) => (
                  <div key={payment.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{payment.activity}</div>
                      <div className="text-sm text-muted-foreground">{payment.date}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        payment.type === "season" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {payment.type === "season" ? "季繳" : "單次"}
                      </span>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">${payment.amount}</div>
                        <div className="text-xs text-primary">已繳費</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trend">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-6">近 6 個月活動參與</h3>
              <div className="flex items-end justify-between gap-2 h-48">
                {mockActivityTrend.map((item, index) => {
                  const maxCount = Math.max(...mockActivityTrend.map(i => i.count));
                  const height = (item.count / maxCount) * 100;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-primary/20 rounded-t-md relative group cursor-pointer transition-colors hover:bg-primary/30"
                        style={{ height: `${height}%` }}
                      >
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all duration-300"
                          style={{ height: `${(item.count / maxCount) * 100}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.count} 場
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 編輯資料 Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>編輯個人資料</DialogTitle>
            <DialogDescription>
              更新您的個人資訊，完成後點擊儲存。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="請輸入姓名"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">電話</Label>
              <Input
                id="phone"
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="請輸入電話號碼"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="請輸入 Email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              儲存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
