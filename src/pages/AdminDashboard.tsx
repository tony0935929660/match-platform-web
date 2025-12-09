import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  MoreVertical,
  FileText,
  Star,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const mockPendingActivities = [
  { id: "1", title: "週末網球邀請賽", host: "李大華", sport: "網球", date: "2024/12/15", status: "pending" },
  { id: "2", title: "籃球街頭賽", host: "陳志強", sport: "籃球", date: "2024/12/16", status: "pending" },
];

const mockPendingCoaches = [
  { id: "1", name: "張志明", sport: "羽球", certification: "國家級教練證", submitted: "2024/12/08" },
  { id: "2", name: "林美華", sport: "網球", certification: "ITF Level 1", submitted: "2024/12/07" },
];

const mockPendingPayments = [
  { id: "1", userName: "王小明", clubName: "羽翔俱樂部", amount: 2400, type: "季繳", proofUrl: "#", submitted: "2024/12/09" },
  { id: "2", userName: "陳美玲", clubName: "網球聯盟", amount: 150, type: "單次", proofUrl: "#", submitted: "2024/12/09" },
];

const mockCreditReviews = [
  { id: "1", userName: "張明德", currentScore: 3.2, reason: "連續缺席 3 次", reporter: "王小明", date: "2024/12/08" },
  { id: "2", userName: "劉小華", currentScore: 2.8, reason: "未經通知取消報名", reporter: "李大華", date: "2024/12/07" },
];

const mockReportedUsers = [
  { id: "1", userName: "趙大明", reports: 5, reason: "惡意取消報名", status: "pending" },
  { id: "2", userName: "周小華", reports: 3, reason: "不當言論", status: "pending" },
];

const mockStats = {
  totalUsers: 2847,
  activeClubs: 156,
  activitiesThisMonth: 423,
  revenue: 128400,
};

export default function AdminDashboard() {
  const handleApprove = (type: string, id: string) => {
    toast({
      title: "已核准",
      description: `${type} #${id} 已成功核准`,
    });
  };

  const handleReject = (type: string, id: string) => {
    toast({
      title: "已拒絕",
      description: `${type} #${id} 已被拒絕`,
      variant: "destructive",
    });
  };

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">管理後台</h1>
            <p className="text-muted-foreground">審核內容與管理平台</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">總用戶數</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Shield className="h-4 w-4" />
                <span className="text-sm">活躍球團</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.activeClubs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">本月活動</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.activitiesThisMonth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">平台收入</span>
              </div>
              <div className="text-2xl font-bold text-foreground">${mockStats.revenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Items Alert */}
        <div className="flex items-center gap-3 p-4 mb-8 rounded-xl bg-warning/10 border border-warning/20">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span className="text-sm text-foreground">
            目前有 <strong>{mockPendingActivities.length + mockPendingCoaches.length + mockPendingPayments.length}</strong> 項待審核項目
          </span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="activities" className="gap-2">
              <Calendar className="h-4 w-4" />
              活動審核
              <Badge variant="secondary">{mockPendingActivities.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="coaches" className="gap-2">
              <Star className="h-4 w-4" />
              教練認證
              <Badge variant="secondary">{mockPendingCoaches.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <FileText className="h-4 w-4" />
              匯款審核
              <Badge variant="secondary">{mockPendingPayments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="credit" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              信用覆核
              <Badge variant="secondary">{mockCreditReviews.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <Ban className="h-4 w-4" />
              檢舉處理
              <Badge variant="secondary">{mockReportedUsers.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Activities Review */}
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>活動審核</CardTitle>
                <CardDescription>審核新建立的活動</CardDescription>
              </CardHeader>
              <CardContent>
                {mockPendingActivities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>目前沒有待審核的活動</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockPendingActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.host} · {activity.sport} · {activity.date}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApprove("活動", activity.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            核准
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleReject("活動", activity.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            拒絕
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coach Verification */}
          <TabsContent value="coaches">
            <Card>
              <CardHeader>
                <CardTitle>教練認證審核</CardTitle>
                <CardDescription>審核教練資格認證申請</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPendingCoaches.map((coach) => (
                    <div key={coach.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">{coach.name[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{coach.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {coach.sport} · {coach.certification}
                          </div>
                          <div className="text-xs text-muted-foreground">提交於 {coach.submitted}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          查看證書
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleApprove("教練認證", coach.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          核准
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleReject("教練認證", coach.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          拒絕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Verification */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>匯款證明審核</CardTitle>
                <CardDescription>審核用戶提交的匯款證明</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPendingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{payment.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.clubName} · {payment.type}
                        </div>
                        <div className="text-xs text-muted-foreground">提交於 {payment.submitted}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-foreground">${payment.amount}</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          查看證明
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleApprove("匯款", payment.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          確認
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleReject("匯款", payment.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          拒絕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credit Review */}
          <TabsContent value="credit">
            <Card>
              <CardHeader>
                <CardTitle>信用評價覆核</CardTitle>
                <CardDescription>審核信用評分異常案例</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCreditReviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                          <span className="font-medium text-destructive">{review.userName[0]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{review.userName}</span>
                            <Badge variant="destructive">信用 {review.currentScore}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{review.reason}</div>
                          <div className="text-xs text-muted-foreground">
                            由 {review.reporter} 回報 · {review.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">維持評分</Button>
                        <Button size="sm">調整評分</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>檢舉處理</CardTitle>
                <CardDescription>處理用戶檢舉與限制</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                          <span className="font-medium text-destructive">{user.userName[0]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{user.userName}</span>
                            <Badge variant="destructive">{user.reports} 次檢舉</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{user.reason}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">警告</Button>
                        <Button variant="outline" size="sm" className="text-warning border-warning hover:bg-warning/10">
                          限制功能
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Ban className="h-4 w-4 mr-1" />
                          封鎖帳號
                        </Button>
                      </div>
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
