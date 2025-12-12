import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const sportTypes: SportType[] = ["badminton", "tennis", "basketball", "volleyball", "table-tennis", "soccer"];

export default function NewActivity() {
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
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/activities")}>
                查看所有活動
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
          <Link to="/activities" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            返回活動列表
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">開新活動</h1>
          <p className="text-muted-foreground mt-1">建立一個新的活動，邀請球友一起運動</p>
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
          </div>

          {/* Sidebar Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">活動預覽</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <SportBadge sport={activity.sport} size="sm" />
                    </div>
                    
                    <h3 className="font-semibold text-foreground">
                      {activity.title || "活動名稱"}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{activity.date || "選擇日期"} {activity.startTime && activity.endTime ? `${activity.startTime}-${activity.endTime}` : ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location || "選擇場地"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>0/{activity.maxSlots} 人</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>${activity.price} / 人</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">等級：</span>
                        <SkillLevelBadge level={activity.levelMin} size="sm" />
                        <span className="text-muted-foreground">-</span>
                        <SkillLevelBadge level={activity.levelMax} size="sm" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                className="w-full mt-4" 
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "建立中..." : "建立活動"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
