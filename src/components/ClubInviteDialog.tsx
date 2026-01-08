import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
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
import { QrCode, UserPlus, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClubInviteDialogProps {
  clubId: string;
  clubName: string;
  trigger?: React.ReactNode;
}

export function ClubInviteDialog({ clubId, clubName, trigger }: ClubInviteDialogProps) {
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // 生成邀請連結 (使用者掃描後會導向的頁面)
  const inviteUrl = `${window.location.origin}/club/join/${clubId}`;

  const handleCopyLink = async () => {
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
      // TODO: 呼叫 API 將使用者加入球團
      // await api.addMemberToClub(clubId, userId);
      
      toast({
        title: "已送出邀請",
        description: `已邀請使用者 ${userId} 加入球團`,
      });
      setUserId("");
    } catch {
      toast({
        title: "邀請失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
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
              <div className="p-4 bg-white rounded-xl">
                <QRCodeSVG
                  value={inviteUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                讓成員掃描此 QR Code 即可加入球團
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                value={inviteUrl}
                readOnly
                className="text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              球團 ID: <code className="px-1.5 py-0.5 bg-muted rounded">{clubId}</code>
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
