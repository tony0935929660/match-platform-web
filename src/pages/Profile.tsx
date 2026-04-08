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
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile, UserProfile, UpdateUserRequest, getUserMatches } from "@/services/userApi";
import { MatchResponse } from "@/services/matchApi";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { format, subMonths } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { zhTW } from "date-fns/locale";

// Mapping for sport ID to SportBadge type
const sportValueToType: Record<number, SportType> = {
  1: "badminton",
  2: "tennis",
  3: "basketball",
  4: "volleyball",
  5: "table-tennis",
  6: "soccer",
};

const mockPaymentHistory = [
  { id: "1", date: "2024/12/04", activity: "週三羽球交流賽", amount: 150, type: "single", status: "paid" },
  { id: "2", date: "2024/12/01", activity: "網球友誼賽", amount: 200, type: "single", status: "paid" },
  { id: "3", date: "2024/11/27", activity: "羽翔俱樂部 - 季繳", amount: 2400, type: "season", status: "paid" },
  { id: "4", date: "2024/11/20", activity: "籃球3v3鬥牛", amount: 100, type: "single", status: "paid" },
];



// const mockSkills = [
//   { sport: "badminton" as SportType, level: 5, confidence: "high" as const, trend: "up" as const },
//   { sport: "tennis" as SportType, level: 3, confidence: "medium" as const, trend: "stable" as const },
//   { sport: "basketball" as SportType, level: 4, confidence: "high" as const, trend: "up" as const },
// ];

// Remove hardcoded mock activities
const myCreatedActivities = [];
const myJoinedActivities = [];
const myHistoryActivities = [];

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
  const PREVIEW_LIMIT = 5;

  // Load user matches
  const { data: userMatchesData, isLoading: isLoadingMatches } = useQuery({
    queryKey: ['userMatches'],
    queryFn: () => getUserMatches(token!, { pageSize: 100 }),
    enabled: !!token
  });

  const allMatches = userMatchesData?.data || [];

  // Filter matches
  const now = new Date();

  // Created: Hosted by user (role === 1)
  // Exclude history
  const hostedMatches = allMatches.filter(m => m.userRole === 1 && new Date(m.endDateTime) >= now);

  // Joined: Participating (role === 2) or Alternative (role === 3)
  // Exclude history
  const joinedMatches = allMatches.filter(m => (m.userRole === 2 || m.userRole === 3) && new Date(m.endDateTime) >= now);

  // History: Both hosted and joined in the past
  const historyMatches = allMatches.filter(m => new Date(m.endDateTime) < now);

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
 
  // Calculate activity trend (Last 6 months)
  const activityTrend = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, 5 - i);
    const monthKey = format(d, "M月", { locale: zhTW });
    // Filter history matches that happened in this month
    const count = historyMatches.filter(m => {
        const matchDate = new Date(m.dateTime);
        return matchDate.getMonth() === d.getMonth() && matchDate.getFullYear() === d.getFullYear();
    }).length;

    return { month: monthKey, count };
  });

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
            <div className="text-3xl font-bold text-foreground">{allMatches.length}</div>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">已開團</span>
            </div>
            {/* Count hosted matches from all matches including history */}
            <div className="text-3xl font-bold text-foreground">{allMatches.filter(m => m.userRole === 1).length}</div>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">本月活動</span>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {allMatches.filter(m => {
                const d = new Date(m.dateTime);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </div>
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="created" className="gap-2">
                我開的團
                <Badge variant="secondary" className="ml-1">{hostedMatches.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="joined" className="gap-2">
                我報名的
                <Badge variant="secondary" className="ml-1">{joinedMatches.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                歷史活動
                <Badge variant="secondary" className="ml-1">{historyMatches.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <Link to="/profile/activities" className="w-full md:w-auto">
              <Button variant="ghost" size="sm" className="w-full md:w-auto gap-1">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Created Activities */}
          <TabsContent value="created" className="space-y-4">
            {hostedMatches.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">還沒有開過團</h3>
                <p className="text-muted-foreground mb-4">開始你的第一個活動吧！</p>
                <Link to="/club/new-activity">
                  <Button>開新活動</Button>
                </Link>
              </div>
            ) : (
              <>
              {hostedMatches.slice(0, PREVIEW_LIMIT).map((activity) => (
                <div key={activity.id} className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SportBadge sport={sportValueToType[activity.sport] || "badminton"} size="sm" />
                        {activity.isGuestPlayerAllowed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            開放臨打
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{activity.name}</h3>
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
                        <div className="flex items-center gap-1.5 justify-end">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">
                            {activity.participants?.length || 0}/{activity.requiredPeople || "?"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(activity.requiredPeople - (activity.participants?.length || 0)) > 0 
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
                          <DropdownMenuItem>候補管理</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">取消活動</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
              

              </>
            )}
          </TabsContent>

          {/* Joined Activities */}
          <TabsContent value="joined" className="space-y-4">
            {joinedMatches.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">還沒有報名活動</h3>
                <p className="text-muted-foreground mb-4">探索附近的運動揪團吧！</p>
                <Link to="/activities">
                  <Button>找活動</Button>
                </Link>
              </div>
            ) : (
              <>
              {joinedMatches.slice(0, PREVIEW_LIMIT).map((activity) => (
                <div key={activity.id} className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SportBadge sport={sportValueToType[activity.sport] || "badminton"} size="sm" />
                        {activity.userRole === 3 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                            <AlertCircle className="h-3 w-3" />
                            候補
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <CheckCircle className="h-3 w-3" />
                            已確認
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">{activity.name}</h3>
                      <div className="text-sm text-muted-foreground mb-2">主揪：{activity.host || activity.groupName || "未知"}</div>
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
                      <Button variant="outline" size="sm">查看詳情</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        取消報名
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              

              </>
            )}
          </TabsContent>

          {/* History Activities */}
          <TabsContent value="history" className="space-y-4">
            {historyMatches.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">還沒有歷史活動</h3>
                <p className="text-muted-foreground">參加活動後會顯示在這裡</p>
              </div>
            ) : (
              <>
              {historyMatches.slice(0, PREVIEW_LIMIT).map((activity) => (
                <div key={activity.id} className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SportBadge sport={sportValueToType[activity.sport] || "badminton"} size="sm" />
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                            已結束
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">{activity.name}</h3>
                      <div className="text-sm text-muted-foreground mb-2">主揪：{activity.host || activity.groupName || "未知"}</div>
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
                        <Button size="sm" variant="outline">查看詳情</Button>
                    </div>
                  </div>
                </div>
              ))}


              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Payment & Trend Tabs */}
        <Tabs defaultValue="trend" className="space-y-6">
          <TabsList>
            {/* <TabsTrigger value="payments" className="gap-2">
              <DollarSign className="h-4 w-4" />
              繳費紀錄
            </TabsTrigger> */}
            <TabsTrigger value="trend" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              參與趨勢
            </TabsTrigger>
          </TabsList>

          {/* <TabsContent value="payments">
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
          </TabsContent> */}

          <TabsContent value="trend">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-6">近 6 個月活動參與</h3>
              {!isLoadingMatches && historyMatches.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
                  尚無歷史活動資料
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={activityTrend} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value} 場`, "參與場次"]}
                      contentStyle={{
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      className="stroke-primary"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
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
