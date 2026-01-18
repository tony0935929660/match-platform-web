import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useMutation } from "@tanstack/react-query";
import { createInviteLink, addMemberToGroup } from "@/services/groupApi";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, UserPlus, Copy, RefreshCw, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";

interface ClubInviteDialogProps {
  clubId: string;
  clubName: string;
  trigger?: React.ReactNode;
}

export function ClubInviteDialog({ clubId, clubName, trigger }: ClubInviteDialogProps) {
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentInviteCode, setCurrentInviteCode] = useState<string | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const createLinkMutation = useMutation({
    mutationFn: () => createInviteLink(token!, clubId, {
      expiresAt: addDays(new Date(), 1).toISOString(), // Generate for 1 day
      maxUses: 2147483647,
    }),
    onSuccess: (data) => {
      setCurrentInviteCode(data.code);
    },
    onError: (error) => {
      toast({
        title: "生成邀請連結失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Fetch a new link when dialog opens if we don't have one
  useEffect(() => {
    if (isOpen && !currentInviteCode && !createLinkMutation.isPending && !createLinkMutation.isSuccess) {
      createLinkMutation.mutate();
    }
  }, [isOpen]);

  // 生成邀請連結 (使用者掃描後會導向的頁面)
  // Assuming we have a route /club/join/:code for users to land on
  const inviteUrl = currentInviteCode ? `${window.location.origin}/club/join/${currentInviteCode}` : "";

  const handleCopyLink = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: "已複製連結",
        description: "邀請連結已複製到剪貼簿",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "複製失敗",
        description: "請手動複製連結",
        variant: "destructive",
      });
    }
  };

  const handleRefreshLink = () => {
    createLinkMutation.mutate();
  };

  const handleAddMember = async () => {
    if (!userId.trim()) {
      toast({
        title: "請輸入使用者 ID",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addMemberToGroup(token!, clubId, userId);
      
      toast({
        title: "已送出邀請",
        description: `已成功將使用者 ${userId} 加入球團`,
      });
      setUserId("");
      setIsOpen(false);
    } catch(error: any) {
      toast({
        title: "邀請失敗",
        description: error.message || "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <QrCode className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>邀請成員加入 {clubName}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="qrcode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qrcode" className="gap-2">
              <QrCode className="h-4 w-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <UserPlus className="h-4 w-4" />
              手動輸入
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="qrcode" className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="p-4 bg-white rounded-xl relative">
                  {createLinkMutation.isPending ? (
                    <div className="w-[200px] h-[200px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : currentInviteCode ? (
                    <QRCodeSVG
                      value={inviteUrl}
                      size={200}
                      level="H"
                      includeMargin={false}
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] flex items-center justify-center text-muted-foreground">
                      無法生成 QR Code
                    </div>
                  )}
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              讓成員掃描此 QR Code 即可加入球團
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={handleRefreshLink}
                disabled={createLinkMutation.isPending}
              >
                <RefreshCw className={`h-3 w-3 ${createLinkMutation.isPending ? "animate-spin" : ""}`} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  連結
                </Label>
                <Input
                  id="link"
                  value={inviteUrl}
                  readOnly
                  className="h-9"
                />
              </div>
              <Button size="sm" className="px-3" onClick={handleCopyLink} disabled={!inviteUrl}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            
            <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
              <p>此連結將於 1 天後失效。您可以隨時刷新以產生新的邀請連結。</p>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">使用者 ID</Label>
              <Input
                id="userId"
                placeholder="輸入使用者 ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                輸入使用者的 ID 直接將其加入球團
              </p>
            </div>
            
            <Button
              className="w-full"
              onClick={handleAddMember}
              disabled={isSubmitting || !userId.trim()}
            >
              {isSubmitting ? "處理中..." : "加入球團"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
