import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Download,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

const mockPayments = [
  { id: "1", userName: "陳美玲", type: "single", amount: 150, date: "2024/12/09", status: "pending", proof: true, activityName: "週三羽球交流賽" },
  { id: "2", userName: "張明德", type: "single", amount: 180, date: "2024/12/09", status: "unpaid", proof: false, activityName: "週三羽球交流賽" },
  { id: "3", userName: "李大華", type: "season", amount: 2400, date: "2024/11/01", status: "paid", proof: true, activityName: "2024秋季季繳" },
  { id: "4", userName: "王小明", type: "season", amount: 2400, date: "2024/11/01", status: "paid", proof: true, activityName: "2024秋季季繳" },
  { id: "5", userName: "黃志強", type: "single", amount: 150, date: "2024/12/04", status: "paid", proof: true, activityName: "週三羽球交流賽" },
  { id: "6", userName: "林小芳", type: "single", amount: 150, date: "2024/12/04", status: "paid", proof: true, activityName: "週三羽球交流賽" },
];

export default function ClubPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const pendingPayments = mockPayments.filter(p => p.status === "pending");
  const unpaidPayments = mockPayments.filter(p => p.status === "unpaid");
  const paidPayments = mockPayments.filter(p => p.status === "paid");

  const filteredPayments = mockPayments.filter(payment => 
    payment.userName.includes(searchQuery) || payment.activityName.includes(searchQuery)
  );

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/club">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">收款管理</h1>
            <p className="text-muted-foreground mt-1">管理球團收款紀錄</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              匯出
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新增季繳方案
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">$12,400</div>
              <div className="text-sm text-muted-foreground">本季總收入</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{paidPayments.length}</div>
              <div className="text-sm text-muted-foreground">已確認</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">{pendingPayments.length}</div>
              <div className="text-sm text-muted-foreground">待確認</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-destructive">{unpaidPayments.length}</div>
              <div className="text-sm text-muted-foreground">未繳費</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋成員或活動..."
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
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">全部 ({mockPayments.length})</TabsTrigger>
            <TabsTrigger value="pending">待確認 ({pendingPayments.length})</TabsTrigger>
            <TabsTrigger value="unpaid">未繳費 ({unpaidPayments.length})</TabsTrigger>
            <TabsTrigger value="paid">已確認 ({paidPayments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>所有收款紀錄</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredPayments.map((payment) => (
                    <PaymentItem key={payment.id} payment={payment} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>待確認收款</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingPayments.map((payment) => (
                    <PaymentItem key={payment.id} payment={payment} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unpaid">
            <Card>
              <CardHeader>
                <CardTitle>未繳費</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unpaidPayments.map((payment) => (
                    <PaymentItem key={payment.id} payment={payment} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paid">
            <Card>
              <CardHeader>
                <CardTitle>已確認收款</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paidPayments.map((payment) => (
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

function PaymentItem({ payment }: { payment: typeof mockPayments[0] }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
      <div className="flex-1">
        <div className="font-medium text-foreground">{payment.userName}</div>
        <div className="text-sm text-muted-foreground">{payment.activityName}</div>
        <div className="text-xs text-muted-foreground">{payment.date}</div>
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
  );
}
