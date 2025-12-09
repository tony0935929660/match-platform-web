import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft,
  Download,
  Search,
  MoreVertical,
  Filter,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const mockPayments = [
  { id: "1", userName: "陳美玲", amount: 9600, date: "2024/12/09", status: "pending", sessions: 12, phone: "0934-567-890" },
  { id: "2", userName: "張明德", amount: 9600, date: "2024/12/08", status: "unpaid", sessions: 12, phone: "0967-890-123" },
  { id: "3", userName: "李大華", amount: 9600, date: "2024/11/01", status: "paid", sessions: 12, phone: "0923-456-789" },
  { id: "4", userName: "王小明", amount: 9600, date: "2024/11/01", status: "paid", sessions: 12, phone: "0912-345-678" },
  { id: "5", userName: "黃志強", amount: 9600, date: "2024/11/01", status: "paid", sessions: 12, phone: "0945-678-901" },
  { id: "6", userName: "林小芳", amount: 9600, date: "2024/10/15", status: "paid", sessions: 12, phone: "0956-789-012" },
  { id: "7", userName: "周美麗", amount: 9600, date: "2024/10/15", status: "paid", sessions: 12, phone: "0978-901-234" },
  { id: "8", userName: "吳建國", amount: 9600, date: "2024/10/01", status: "paid", sessions: 12, phone: "0989-012-345" },
];

export default function CoursePayments() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const pendingPayments = mockPayments.filter(p => p.status === "pending" || p.status === "unpaid");
  const completedPayments = mockPayments.filter(p => p.status === "paid");

  const filteredPending = pendingPayments.filter(payment => 
    payment.userName.includes(searchQuery) || payment.phone.includes(searchQuery)
  );

  const filteredCompleted = completedPayments.filter(payment => 
    payment.userName.includes(searchQuery) || payment.phone.includes(searchQuery)
  );

  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/course">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">收費管理</h1>
            <p className="text-muted-foreground mt-1">管理課程學員繳費</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            匯出報表
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">已收款總額</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">${pendingAmount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">待收款金額</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{completedPayments.length}</div>
              <div className="text-sm text-muted-foreground">已繳費人數</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">{pendingPayments.length}</div>
              <div className="text-sm text-muted-foreground">待繳費人數</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋學員姓名或電話..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            篩選
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">待處理 ({pendingPayments.length})</TabsTrigger>
            <TabsTrigger value="completed">已完成 ({completedPayments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>待處理繳費</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredPending.map((payment) => (
                    <PaymentItem key={payment.id} payment={payment} showActions />
                  ))}
                  {filteredPending.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      沒有待處理的繳費
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>已完成繳費</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredCompleted.map((payment) => (
                    <PaymentItem key={payment.id} payment={payment} />
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

interface PaymentItemProps {
  payment: {
    id: string;
    userName: string;
    amount: number;
    date: string;
    status: string;
    sessions: number;
    phone: string;
  };
  showActions?: boolean;
}

function PaymentItem({ payment, showActions = false }: PaymentItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="font-medium text-primary">{payment.userName[0]}</span>
        </div>
        <div>
          <span className="font-medium text-foreground">{payment.userName}</span>
          <div className="text-sm text-muted-foreground">
            {payment.sessions} 堂課程 · {payment.phone}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-semibold text-foreground">${payment.amount.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">{payment.date}</div>
        </div>
        <Badge variant={payment.status === "paid" ? "default" : payment.status === "pending" ? "secondary" : "destructive"}>
          {payment.status === "paid" ? "已付款" : payment.status === "pending" ? "待確認" : "未付款"}
        </Badge>
        {showActions ? (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>查看詳情</DropdownMenuItem>
              <DropdownMenuItem>發送收據</DropdownMenuItem>
              <DropdownMenuItem>退款</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
