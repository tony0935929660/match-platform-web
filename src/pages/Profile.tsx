import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { CreditCard } from "@/components/ui/CreditBadge";
import { SkillLevelCard } from "@/components/ui/SkillLevelBadge";
import { SportType } from "@/components/ui/SportBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const mockUserProfile = {
  name: "王小明",
  email: "wang.xiaoming@email.com",
  avatar: "",
  memberSince: "2023/06",
  creditScore: 4.8,
  creditConfidence: "high" as const,
  attendanceRate: 95,
  cancelRate: 3,
  absenceCount: 1,
  skills: [
    { sport: "badminton" as SportType, level: 5, confidence: "high" as const, trend: "up" as const },
    { sport: "tennis" as SportType, level: 3, confidence: "medium" as const, trend: "stable" as const },
    { sport: "basketball" as SportType, level: 4, confidence: "high" as const, trend: "up" as const },
  ],
  stats: {
    totalActivities: 48,
    hostedActivities: 12,
    thisMonth: 6,
  },
};

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

export default function Profile() {
  const user = mockUserProfile;

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold text-primary">{user.name[0]}</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-1">會員自 {user.memberSince}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
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
            <div className="text-3xl font-bold text-foreground">{user.stats.totalActivities}</div>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">已開團</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{user.stats.hostedActivities}</div>
          </div>
          <div className="p-4 md:p-6 rounded-xl bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">本月活動</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{user.stats.thisMonth}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Credit Card */}
          <CreditCard
            score={user.creditScore}
            confidence={user.creditConfidence}
            attendanceRate={user.attendanceRate}
            cancelRate={user.cancelRate}
            absenceCount={user.absenceCount}
          />
          
          {/* Skill Level Card */}
          <SkillLevelCard skills={user.skills} />
        </div>

        {/* Tabs */}
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
    </MainLayout>
  );
}
