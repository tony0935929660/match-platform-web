import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { SportBadge, SportType, sportConfig } from "@/components/ui/SportBadge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Trophy,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const sportTypes: SportType[] = ["badminton", "tennis", "basketball", "volleyball", "table-tennis", "soccer"];

export default function ClubNewActivity() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [activity, setActivity] = useState({
    title: "",
    sport: "badminton" as SportType,
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    description: "",
    maxSlots: 8,
    price: 150,
    levelMin: 1,
    levelMax: 8,
    // Club-specific: Casual settings
    isCasualOpen: true,
    casualSlots: 2,
    casualFee: 180,
    needsApproval: false,
    // Club-specific: Scoring mode
    isScoringMode: false,
    // Club-specific: Waitlist
    waitlistEnabled: true,
    waitlistOpenTime: "18:00",
  });

  const handleSubmit = () => {
    if (!activity.title || !activity.date || !activity.location) {
      toast({
        title: "請填寫必要欄位",
        description: "活動名稱、日期和地點為必填",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      toast({
        title: "活動建立成功！",
        description: "你的活動已成功建立，等待球友報名中",
      });
    }, 800);
  };

  if (showSuccess) {
    return (
      <MainLayout>
        <div className="container py-8 md:py-12">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">活動建立成功！</h1>
            <p className="text-muted-foreground mb-8">你的活動已成功建立，等待球友報名中</p>
            
            {/* Activity Preview Card */}
            <Card className="text-left mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <SportBadge sport={activity.sport} size="sm" />
                  {activity.isCasualOpen && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      開放臨打
                    </span>
                  )}
                  {activity.isScoringMode && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sport-tennis/10 text-sport-tennis">
                      <Trophy className="h-3 w-3" />
                      計分模式
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{activity.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{activity.date} {activity.startTime}-{activity.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>0/{activity.maxSlots} 人</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>${activity.price} / 人</span>
                    {activity.isCasualOpen && (
                      <span className="text-muted-foreground">（臨打 ${activity.casualFee}）</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/club")}>
                返回球團
              </Button>
              <Button className="flex-1" onClick={() => {
                setShowSuccess(false);
                setActivity({
                  title: "",
                  sport: "badminton",
                  date: "",
                  startTime: "",
                  endTime: "",
                  location: "",
                  address: "",
                  description: "",
                  maxSlots: 8,
                  price: 150,
                  levelMin: 1,
                  levelMax: 8,
                  isCasualOpen: true,
                  casualSlots: 2,
                  casualFee: 180,
                  needsApproval: false,
                  isScoringMode: false,
                  waitlistEnabled: true,
                  waitlistOpenTime: "18:00",
                });
              }}>
                再開一團
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/club" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            返回球團管理
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">新增活動</h1>
          <p className="text-muted-foreground mt-1">為你的球團建立新的活動</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>基本資訊</CardTitle>
                <CardDescription>填寫活動的基本資訊</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Sport Type */}
                <div className="space-y-2">
                  <Label>運動類型</Label>
                  <div className="flex flex-wrap gap-2">
                    {sportTypes.map((sport) => (
                      <Button
                        key={sport}
                        type="button"
                        variant={activity.sport === sport ? "default" : "outline"}
                        size="sm"
                        className="gap-1"
                        onClick={() => setActivity({ ...activity, sport })}
                      >
                        <span>{sportConfig[sport].emoji}</span>
                        <span>{sportConfig[sport].label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">活動名稱 *</Label>
                  <Input
                    id="title"
                    placeholder="例：週三羽球交流賽"
                    value={activity.title}
                    onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="date">日期 *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10"
                        value={activity.date}
                        onChange={(e) => setActivity({ ...activity, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">開始時間</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="startTime"
                        type="time"
                        className="pl-10"
                        value={activity.startTime}
                        onChange={(e) => setActivity({ ...activity, startTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">結束時間</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="endTime"
                        type="time"
                        className="pl-10"
                        value={activity.endTime}
                        onChange={(e) => setActivity({ ...activity, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">場地名稱 *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="例：台北市大安運動中心"
                      className="pl-10"
                      value={activity.location}
                      onChange={(e) => setActivity({ ...activity, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">詳細地址</Label>
                  <Input
                    id="address"
                    placeholder="例：台北市大安區辛亥路三段55號"
                    value={activity.address}
                    onChange={(e) => setActivity({ ...activity, address: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">活動說明</Label>
                  <Textarea
                    id="description"
                    placeholder="描述活動內容、注意事項..."
                    rows={4}
                    value={activity.description}
                    onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Slots & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>名額與費用</CardTitle>
                <CardDescription>設定活動的名額上限與費用</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxSlots">名額上限</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="maxSlots"
                        type="number"
                        className="pl-10"
                        min={2}
                        max={50}
                        value={activity.maxSlots}
                        onChange={(e) => setActivity({ ...activity, maxSlots: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">費用 (每人)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        className="pl-10"
                        min={0}
                        value={activity.price}
                        onChange={(e) => setActivity({ ...activity, price: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Level Range */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>等級範圍</Label>
                    <div className="flex items-center gap-2">
                      <SkillLevelBadge level={activity.levelMin} size="sm" />
                      <span className="text-muted-foreground">-</span>
                      <SkillLevelBadge level={activity.levelMax} size="sm" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Slider
                      value={[activity.levelMin, activity.levelMax]}
                      onValueChange={([min, max]) => setActivity({ ...activity, levelMin: min, levelMax: max })}
                      min={1}
                      max={8}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>L1 初學</span>
                      <span>L8 專業</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Casual Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>臨打設定</CardTitle>
                    <CardDescription>開放讓非團員臨時參加</CardDescription>
                  </div>
                  <Switch
                    checked={activity.isCasualOpen}
                    onCheckedChange={(checked) => setActivity({ ...activity, isCasualOpen: checked })}
                  />
                </div>
              </CardHeader>
              {activity.isCasualOpen && (
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium text-primary">🟢 開放臨打</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="casualSlots">臨打名額</Label>
                      <Input
                        id="casualSlots"
                        type="number"
                        min={1}
                        max={10}
                        value={activity.casualSlots}
                        onChange={(e) => setActivity({ ...activity, casualSlots: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="casualFee">臨打費用</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="casualFee"
                          type="number"
                          className="pl-8"
                          min={0}
                          value={activity.casualFee}
                          onChange={(e) => setActivity({ ...activity, casualFee: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="needsApproval"
                      checked={activity.needsApproval}
                      onCheckedChange={(checked) => setActivity({ ...activity, needsApproval: checked })}
                    />
                    <Label htmlFor="needsApproval" className="cursor-pointer">
                      臨打需要審核
                    </Label>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle>進階設定</CardTitle>
                <CardDescription>候補與計分模式設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Waitlist */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div>
                    <div className="font-medium text-foreground">候補機制</div>
                    <div className="text-sm text-muted-foreground">額滿後自動開啟候補名單</div>
                  </div>
                  <Switch
                    checked={activity.waitlistEnabled}
                    onCheckedChange={(checked) => setActivity({ ...activity, waitlistEnabled: checked })}
                  />
                </div>

                {activity.waitlistEnabled && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <Label htmlFor="waitlistOpenTime">候補開啟時間</Label>
                    <div className="relative w-40">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="waitlistOpenTime"
                        type="time"
                        className="pl-10"
                        value={activity.waitlistOpenTime}
                        onChange={(e) => setActivity({ ...activity, waitlistOpenTime: e.target.value })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">活動當天此時間自動開啟候補遞補</p>
                  </div>
                )}

                {/* Scoring Mode */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Trophy className="h-4 w-4 text-sport-tennis" />
                      計分模式
                    </div>
                    <div className="text-sm text-muted-foreground">記錄比賽分數與統計</div>
                  </div>
                  <Switch
                    checked={activity.isScoringMode}
                    onCheckedChange={(checked) => setActivity({ ...activity, isScoringMode: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Preview */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>預覽</CardTitle>
                <CardDescription>活動卡片預覽</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl border bg-card shadow-card">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <SportBadge sport={activity.sport} size="sm" />
                        {activity.isCasualOpen && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            開放臨打
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {activity.title || "活動名稱"}
                      </h3>
                    </div>
                    {activity.price > 0 && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">${activity.price}</div>
                        <div className="text-xs text-muted-foreground">/ 人</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{activity.date || "日期"} {activity.startTime || "時間"}-{activity.endTime || ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{activity.location || "地點"}</span>
                    </div>
                  </div>
                  
                  {/* Level */}
                  <div className="flex items-center justify-between py-3 border-t border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">等級</span>
                      <div className="flex items-center gap-1">
                        <SkillLevelBadge level={activity.levelMin} size="sm" />
                        <span className="text-muted-foreground">-</span>
                        <SkillLevelBadge level={activity.levelMax} size="sm" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Slots */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-muted-foreground">名額</div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">0/{activity.maxSlots}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "建立中..." : "建立活動"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
