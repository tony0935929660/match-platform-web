import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { CreditBadge } from "@/components/ui/CreditBadge";
import { WaitlistCard } from "@/components/ui/ActivityCard";
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Users, 
  Star,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Trophy,
  Share2,
  Heart
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const mockActivity = {
  id: "1",
  title: "週三羽球交流賽",
  description: "歡迎羽球愛好者參加我們的週三交流賽！本場活動以雙打為主，採輪流上場制，確保每位參與者都有充足的比賽時間。請自備球拍，場地費含用球。",
  sport: "badminton" as SportType,
  date: "2024/12/11 (三)",
  time: "19:00-21:00",
  location: "台北市大安運動中心 羽球場A",
  address: "台北市大安區辛亥路三段55號",
  hostName: "王小明",
  hostAvatar: "",
  hostCreditScore: 4.8,
  hostConfidence: "high" as const,
  hostAttendanceRate: 98,
  levelRange: { min: 3, max: 5 },
  isCasualOpen: true,
  casualSlots: 2,
  casualFee: 180,
  regularFee: 150,
  currentSlots: 6,
  maxSlots: 8,
  isScoringMode: true,
  waitlistOpenTime: "18:00",
  participants: [
    { id: "1", name: "王小明", level: 5, isHost: true },
    { id: "2", name: "李大華", level: 4, isHost: false },
    { id: "3", name: "陳美玲", level: 4, isHost: false },
    { id: "4", name: "黃志強", level: 3, isHost: false },
    { id: "5", name: "林小芳", level: 5, isHost: false },
    { id: "6", name: "張明德", level: 3, isHost: false },
  ],
  waitlist: [
    { id: "w1", name: "劉小華", joinedAt: "12/09 14:30" },
    { id: "w2", name: "趙大明", joinedAt: "12/09 15:45" },
  ],
};

type RegistrationStep = "confirm" | "identity" | "payment" | "success";

export default function ActivityDetail() {
  const { id } = useParams();
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>("confirm");
  const [selectedIdentity, setSelectedIdentity] = useState<"regular" | "casual">("regular");
  const [selectedPayment, setSelectedPayment] = useState<"single" | "season">("single");
  
  const activity = mockActivity;
  const isFull = activity.currentSlots >= activity.maxSlots;
  const slotsRemaining = activity.maxSlots - activity.currentSlots;

  const handleStartRegistration = () => {
    setShowRegistration(true);
    setRegistrationStep("confirm");
  };

  const handleNextStep = () => {
    if (registrationStep === "confirm") {
      setRegistrationStep("identity");
    } else if (registrationStep === "identity") {
      setRegistrationStep("payment");
    } else if (registrationStep === "payment") {
      setRegistrationStep("success");
      toast({
        title: "報名成功！",
        description: "你已成功報名此活動，記得準時出席喔！",
      });
    }
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
    setRegistrationStep("confirm");
  };

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Back Button */}
        <Link to="/activities" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          返回活動列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <SportBadge sport={activity.sport} size="md" />
                {activity.isCasualOpen && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
                    開放臨打
                  </span>
                )}
                {activity.isScoringMode && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-sport-tennis/10 text-sport-tennis">
                    <Trophy className="h-3.5 w-3.5" />
                    計分模式
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{activity.title}</h1>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  收藏
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  分享
                </Button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">日期</span>
                </div>
                <div className="font-semibold text-foreground">{activity.date}</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">時間</span>
                </div>
                <div className="font-semibold text-foreground">{activity.time}</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">地點</span>
                </div>
                <div className="font-semibold text-foreground">{activity.location}</div>
                <div className="text-sm text-muted-foreground mt-1">{activity.address}</div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-xl border bg-card">
              <h2 className="font-semibold text-foreground mb-3">活動說明</h2>
              <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
            </div>

            {/* Participants */}
            <div className="p-6 rounded-xl border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">參與者</h2>
                <span className="text-sm text-muted-foreground">{activity.currentSlots}/{activity.maxSlots} 人</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activity.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-medium text-primary">{participant.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">{participant.name}</span>
                        {participant.isHost && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">主揪</span>
                        )}
                      </div>
                      <SkillLevelBadge level={participant.level} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waitlist */}
            {activity.waitlist.length > 0 && (
              <div className="p-6 rounded-xl border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">候補名單</h2>
                  <span className="text-sm text-muted-foreground">{activity.waitlist.length} 人候補中</span>
                </div>
                <div className="space-y-2">
                  {activity.waitlist.map((person, index) => (
                    <WaitlistCard
                      key={person.id}
                      position={index + 1}
                      userName={person.name}
                      joinedAt={person.joinedAt}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Register */}
            <div className="p-6 rounded-xl border bg-card shadow-card sticky top-24">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-primary">${activity.regularFee}</div>
                  <div className="text-sm text-muted-foreground">/ 人</div>
                </div>
                {activity.isCasualOpen && (
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">${activity.casualFee}</div>
                    <div className="text-xs text-muted-foreground">臨打價</div>
                  </div>
                )}
              </div>

              {/* Slots Status */}
              <div className="flex items-center justify-between py-3 border-t border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">名額</span>
                </div>
                <div className={`font-semibold ${isFull ? "text-destructive" : "text-foreground"}`}>
                  {activity.currentSlots}/{activity.maxSlots}
                  {!isFull && <span className="text-muted-foreground font-normal"> (剩餘 {slotsRemaining})</span>}
                </div>
              </div>

              {/* Level Range */}
              <div className="flex items-center justify-between py-3 border-b border-border mb-4">
                <span className="text-sm text-muted-foreground">適合等級</span>
                <div className="flex items-center gap-1">
                  <SkillLevelBadge level={activity.levelRange.min} size="sm" />
                  <span className="text-muted-foreground">-</span>
                  <SkillLevelBadge level={activity.levelRange.max} size="sm" />
                </div>
              </div>

              {/* Status Badges */}
              <div className="space-y-2 mb-6">
                {activity.isCasualOpen && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>開放臨打 (剩餘 {activity.casualSlots} 位)</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">候補開啟時間：{activity.waitlistOpenTime}</span>
                </div>
              </div>

              {/* Register Button */}
              <Button 
                className="w-full h-12 text-lg font-semibold" 
                size="lg"
                onClick={handleStartRegistration}
              >
                {isFull ? "加入候補" : "立即報名"}
              </Button>
            </div>

            {/* Host Info */}
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="font-semibold text-foreground mb-4">主揪資訊</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{activity.hostName[0]}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{activity.hostName}</div>
                  <CreditBadge 
                    score={activity.hostCreditScore} 
                    confidence={activity.hostConfidence}
                    showDetails
                    size="sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{activity.hostAttendanceRate}%</div>
                  <div className="text-xs text-muted-foreground">出席率</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">45</div>
                  <div className="text-xs text-muted-foreground">已開團數</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={showRegistration} onOpenChange={handleCloseRegistration}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {registrationStep === "confirm" && "確認報名"}
              {registrationStep === "identity" && "選擇身份"}
              {registrationStep === "payment" && "選擇付款方式"}
              {registrationStep === "success" && "報名成功"}
            </DialogTitle>
            <DialogDescription>
              {registrationStep === "confirm" && "請確認活動資訊"}
              {registrationStep === "identity" && "選擇您的參與身份"}
              {registrationStep === "payment" && "選擇您的付款方式"}
              {registrationStep === "success" && "您已成功報名此活動"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {registrationStep === "confirm" && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary">
                  <div className="font-semibold text-foreground mb-2">{activity.title}</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>{activity.date} {activity.time}</div>
                    <div>{activity.location}</div>
                  </div>
                </div>
              </div>
            )}

            {registrationStep === "identity" && (
              <RadioGroup value={selectedIdentity} onValueChange={(v) => setSelectedIdentity(v as "regular" | "casual")}>
                <div className="space-y-3">
                  <Label
                    htmlFor="regular"
                    className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-secondary transition-colors data-[state=checked]:border-primary"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="regular" id="regular" />
                      <div>
                        <div className="font-medium">正式成員</div>
                        <div className="text-sm text-muted-foreground">加入球團固定參與</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary">${activity.regularFee}</div>
                  </Label>
                  {activity.isCasualOpen && (
                    <Label
                      htmlFor="casual"
                      className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="casual" id="casual" />
                        <div>
                          <div className="font-medium">臨打</div>
                          <div className="text-sm text-muted-foreground">單次參與體驗</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-foreground">${activity.casualFee}</div>
                    </Label>
                  )}
                </div>
              </RadioGroup>
            )}

            {registrationStep === "payment" && (
              <RadioGroup value={selectedPayment} onValueChange={(v) => setSelectedPayment(v as "single" | "season")}>
                <div className="space-y-3">
                  <Label
                    htmlFor="single"
                    className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="single" id="single" />
                      <div>
                        <div className="font-medium">單次繳費</div>
                        <div className="text-sm text-muted-foreground">本次活動現場繳費</div>
                      </div>
                    </div>
                  </Label>
                  <Label
                    htmlFor="season"
                    className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="season" id="season" />
                      <div>
                        <div className="font-medium">季繳方案</div>
                        <div className="text-sm text-muted-foreground">享有折扣優惠</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            )}

            {registrationStep === "success" && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground">記得準時出席，祝你玩得開心！</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {registrationStep !== "success" && (
              <Button variant="outline" className="flex-1" onClick={handleCloseRegistration}>
                取消
              </Button>
            )}
            <Button 
              className="flex-1" 
              onClick={registrationStep === "success" ? handleCloseRegistration : handleNextStep}
            >
              {registrationStep === "success" ? "完成" : "下一步"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
