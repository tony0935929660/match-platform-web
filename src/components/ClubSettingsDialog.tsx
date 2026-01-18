import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateGroup, deleteGroup, UpdateGroupRequest, GroupResponse } from "@/services/groupApi";
import { getSports, SportEnum } from "@/services/enumApi";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClubSettingsDialogProps {
  club: GroupResponse;
  trigger?: React.ReactNode;
}

export function ClubSettingsDialog({ club, trigger }: ClubSettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<UpdateGroupRequest>({
    name: club.name,
    sport: club.sport,
    description: club.description || "",
    court: club.court || "",
    address: club.address || "",
    phone: club.phone || "",
    email: club.email || "",
    websiteUrl: club.websiteUrl || "",
  });

  // Reset form when dialog opens or club changes
  useEffect(() => {
    if (isOpen) {
      setForm({
        name: club.name,
        sport: club.sport,
        description: club.description || "",
        court: club.court || "",
        address: club.address || "",
        phone: club.phone || "",
        email: club.email || "",
        websiteUrl: club.websiteUrl || "",
      });
    }
  }, [isOpen, club]);

  // Fetch sports enum
  const { data: sports = [] } = useQuery<SportEnum[]>({
    queryKey: ["sports"],
    queryFn: getSports,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateGroupRequest) => updateGroup(token!, club.id, data),
    onSuccess: () => {
      toast({
        title: "更新成功",
        description: "球團資料已更新",
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteGroup(token!, club.id),
    onSuccess: () => {
      toast({
        title: "刪除成功",
        description: "球團已刪除",
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setShowDeleteConfirm(false);
      setIsOpen(false);
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "刪除失敗",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!form.name?.trim()) {
      toast({
        title: "請輸入球團名稱",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate(form);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>球團設定</DialogTitle>
            <DialogDescription>
              管理球團資料與設定
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">基本資料</TabsTrigger>
              <TabsTrigger value="danger">危險區域</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">球團名稱 *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="請輸入球團名稱"
                />
              </div>

              {/* Sport */}
              <div className="space-y-2">
                <Label>運動類型</Label>
                <Select
                  value={String(form.sport)}
                  onValueChange={(value) => setForm({ ...form, sport: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇運動類型" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport.value} value={String(sport.value)}>
                        {sport.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">球團簡介</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="介紹你的球團..."
                  rows={3}
                />
              </div>

              {/* Court */}
              <div className="space-y-2">
                <Label htmlFor="court">活動地點</Label>
                <Input
                  id="court"
                  value={form.court}
                  onChange={(e) => setForm({ ...form, court: e.target.value })}
                  placeholder="例：台北市大安運動中心"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">詳細地址</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="例：台北市大安區辛亥路三段55號"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">聯絡電話</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0912-345-678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">電子郵件</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="club@example.com"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">網站連結</Label>
                <Input
                  id="websiteUrl"
                  value={form.websiteUrl}
                  onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </TabsContent>

            <TabsContent value="danger" className="space-y-4 mt-4">
              <div className="rounded-lg border border-destructive/50 p-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-destructive">刪除球團</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    刪除後將無法復原，所有成員、活動紀錄都會被刪除。
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  刪除球團
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              儲存變更
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除球團嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原。刪除後，球團的所有資料、成員、活動紀錄都會被永久刪除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              確定刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
