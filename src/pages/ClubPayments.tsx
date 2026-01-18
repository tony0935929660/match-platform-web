import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Loader2
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  getGroupMembers, 
  getGroupPayments,
  createPayment,
  CreatePaymentRequest,
  PaymentResponse,
  GroupMemberResponse 
} from "@/services/groupApi";
import { getPaymentTypes, PaymentTypeEnum } from "@/services/enumApi";

export default function ClubPayments() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId") || "";
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<CreatePaymentRequest>>({
    userId: undefined,
    paymentType: undefined,
    amount: undefined,
    remark: "",
    startDate: "",
    endDate: "",
  });

  // 獲取成員列表
  const { data: members = [] } = useQuery<GroupMemberResponse[]>({
    queryKey: ['groupMembers', groupId],
    queryFn: () => getGroupMembers(token!, Number(groupId)),
    enabled: !!token && !!groupId,
  });

  // 獲取繳費紀錄
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery<PaymentResponse[]>({
    queryKey: ['groupPayments', groupId],
    queryFn: () => getGroupPayments(token!, Number(groupId)),
    enabled: !!token && !!groupId,
  });

  // 獲取付款類型
  const { data: paymentTypes = [] } = useQuery<PaymentTypeEnum[]>({
    queryKey: ['paymentTypes'],
    queryFn: getPaymentTypes,
  });

  // 新增繳費紀錄 mutation
  const createPaymentMutation = useMutation({
    mutationFn: (data: CreatePaymentRequest) => createPayment(token!, Number(groupId), data),
    onSuccess: () => {
      toast({
        title: "新增成功",
        description: "繳費紀錄已新增",
      });
      queryClient.invalidateQueries({ queryKey: ['groupPayments', groupId] });
      setIsAddDialogOpen(false);
      setNewPayment({
        userId: undefined,
        paymentType: undefined,
        amount: undefined,
        remark: "",
        startDate: "",
        endDate: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "新增失敗",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 單次繳費的 paymentType 值（假設為 1，可根據實際 API 調整）
  const isSinglePayment = newPayment.paymentType === 1;

  const handleCreatePayment = () => {
    if (!newPayment.userId || !newPayment.paymentType || !newPayment.amount) {
      toast({
        title: "請填寫必要欄位",
        description: "成員、付款類型、金額為必填",
        variant: "destructive",
      });
      return;
    }
    // 非單次繳費時，需要填寫開始/結束日期
    if (!isSinglePayment && (!newPayment.startDate || !newPayment.endDate)) {
      toast({
        title: "請填寫方案期間",
        description: "請選擇方案的開始與結束日期",
        variant: "destructive",
      });
      return;
    }
    const now = new Date().toISOString();
    createPaymentMutation.mutate({
      userId: newPayment.userId,
      paymentType: newPayment.paymentType,
      amount: newPayment.amount,
      remark: newPayment.remark || "",
      paymentDate: now,
      startDate: isSinglePayment ? now : new Date(newPayment.startDate!).toISOString(),
      endDate: isSinglePayment ? now : new Date(newPayment.endDate!).toISOString(),
    });
  };
  
  const pendingPayments = payments.filter((p: PaymentResponse) => p.status === 1); // pending
  const unpaidPayments = payments.filter((p: PaymentResponse) => p.status === 0); // unpaid
  const paidPayments = payments.filter((p: PaymentResponse) => p.status === 2); // paid

  const filteredPayments = payments.filter((payment: PaymentResponse) => 
    payment.userName?.includes(searchQuery)
  );

  // 計算總收入
  const totalIncome = paidPayments.reduce((sum: number, p: PaymentResponse) => sum + p.amount, 0);

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/club?groupId=${groupId}`}>
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  新增繳費紀錄
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>新增繳費紀錄</DialogTitle>
                  <DialogDescription>
                    為球團成員新增一筆繳費紀錄
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* 選擇成員 */}
                  <div className="grid gap-2">
                    <Label htmlFor="member">成員 *</Label>
                    <Select
                      value={newPayment.userId?.toString() || ""}
                      onValueChange={(value) => setNewPayment({ ...newPayment, userId: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇成員" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member: GroupMemberResponse) => (
                          <SelectItem key={member.userId} value={member.userId.toString()}>
                            {member.userName || member.lineName || "未知用戶"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* 付款類型 */}
                  <div className="grid gap-2">
                    <Label htmlFor="paymentType">付款類型 *</Label>
                    <Select
                      value={newPayment.paymentType?.toString() || ""}
                      onValueChange={(value) => setNewPayment({ ...newPayment, paymentType: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇付款類型" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTypes.map((type: PaymentTypeEnum) => (
                          <SelectItem key={type.value} value={type.value.toString()}>
                            {type.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* 金額 */}
                  <div className="grid gap-2">
                    <Label htmlFor="amount">金額 *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="請輸入金額"
                      value={newPayment.amount || ""}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                    />
                  </div>
                  {/* 方案期間 - 非單次繳費時顯示 */}
                  {newPayment.paymentType && newPayment.paymentType !== 1 && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">方案開始日期 *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newPayment.startDate || ""}
                          onChange={(e) => setNewPayment({ ...newPayment, startDate: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endDate">方案結束日期 *</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newPayment.endDate || ""}
                          onChange={(e) => setNewPayment({ ...newPayment, endDate: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  {/* 備註 */}
                  <div className="grid gap-2">
                    <Label htmlFor="remark">備註</Label>
                    <Textarea
                      id="remark"
                      placeholder="選填備註"
                      value={newPayment.remark || ""}
                      onChange={(e) => setNewPayment({ ...newPayment, remark: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreatePayment} disabled={createPaymentMutation.isPending}>
                    {createPaymentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    確認新增
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">${totalIncome.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">已確認總收入</div>
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
            <TabsTrigger value="all">全部 ({payments.length})</TabsTrigger>
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
                {isLoadingPayments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "找不到符合的紀錄" : "目前沒有繳費紀錄"}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPayments.map((payment: PaymentResponse) => (
                      <PaymentItem key={payment.id} payment={payment} paymentTypes={paymentTypes} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>待確認收款</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">沒有待確認的紀錄</div>
                ) : (
                  <div className="space-y-3">
                    {pendingPayments.map((payment: PaymentResponse) => (
                      <PaymentItem key={payment.id} payment={payment} paymentTypes={paymentTypes} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unpaid">
            <Card>
              <CardHeader>
                <CardTitle>未繳費</CardTitle>
              </CardHeader>
              <CardContent>
                {unpaidPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">沒有未繳費的紀錄</div>
                ) : (
                  <div className="space-y-3">
                    {unpaidPayments.map((payment: PaymentResponse) => (
                      <PaymentItem key={payment.id} payment={payment} paymentTypes={paymentTypes} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paid">
            <Card>
              <CardHeader>
                <CardTitle>已確認收款</CardTitle>
              </CardHeader>
              <CardContent>
                {paidPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">沒有已確認的紀錄</div>
                ) : (
                  <div className="space-y-3">
                    {paidPayments.map((payment: PaymentResponse) => (
                      <PaymentItem key={payment.id} payment={payment} paymentTypes={paymentTypes} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function PaymentItem({ payment, paymentTypes }: { payment: PaymentResponse; paymentTypes: PaymentTypeEnum[] }) {
  const paymentTypeName = paymentTypes.find(t => t.value === payment.paymentType)?.displayName || payment.paymentTypeName || "未知";
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
      <div className="flex-1">
        <div className="font-medium text-foreground">{payment.userName}</div>
        <div className="text-sm text-muted-foreground">{payment.remark || "-"}</div>
        <div className="text-xs text-muted-foreground">{formatDate(payment.paymentDate)}</div>
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
}
