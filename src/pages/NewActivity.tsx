import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getSports, getAreas, SportEnum, AreaEnum } from "@/services/enumApi";
import { createMatch, CreateMatchRequest } from "@/services/matchApi";

// 運動類型 enum value 對應前端 SportType 的映射
const sportValueToType: Record<number, SportType> = {
  1: "badminton",
  2: "tennis",
  // 以下可以之後擴充
  // 3: "basketball",
  // 4: "volleyball",
  // 5: "table-tennis",
  // 6: "soccer",
};

const sportTypeToValue: Record<string, number> = {
  "badminton": 1,
  "tennis": 2,
  // 以下可以之後擴充
  // "basketball": 3,
  // "volleyball": 4,
  // "table-tennis": 5,
  // "soccer": 6,
};

export default function NewActivity() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Enum 資料
  const [sports, setSports] = useState<SportEnum[]>([]);
  const [areas, setAreas] = useState<AreaEnum[]>([]);
  
  const [activity, setActivity] = useState({
    title: "",
    sport: 1, // 預設羽球
    sportType: "badminton" as SportType, // 前端顯示用
    area: 0,
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

  // 載入 Enum 資料
  useEffect(() => {
    async function loadEnums() {
      try {
        const [sportsData, areasData] = await Promise.all([
          getSports(),
          getAreas(),
        ]);
        setSports(sportsData);
        setAreas(areasData);
        
        // 設定預設值
        if (sportsData.length > 0) {
          const defaultSport = sportsData[0];
          const grades = defaultSport.validGrades || [];
          const minGrade = grades.length > 0 ? Math.min(...grades) : 1;
          const maxGrade = grades.length > 0 ? Math.max(...grades) : 8;
          setActivity(prev => ({
            ...prev,
            sport: defaultSport.value,
            sportType: sportValueToType[defaultSport.value] || "badminton",
            levelMin: minGrade,
            levelMax: maxGrade,
          }));
        }
      } catch (err) {
        console.error("Failed to load enums:", err);
        toast({
          title: "載入失敗",
          description: "無法載入運動類型或地區資料",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadEnums();
  }, []);

  const handleSportChange = (sportValue: number) => {
    const selectedSport = sports.find(s => s.value === sportValue);
    const grades = selectedSport?.validGrades || [];
    const minGrade = grades.length > 0 ? Math.min(...grades) : 1;
    const maxGrade = grades.length > 0 ? Math.max(...grades) : 8;
    
    setActivity({
      ...activity,
      sport: sportValue,
      sportType: sportValueToType[sportValue] || "badminton",
      levelMin: minGrade,
      levelMax: maxGrade,
    });
  };

  const handleSubmit = async () => {
    if (!activity.title || !activity.date || !activity.location) {
      toast({
        title: "請填寫必要欄位",
        description: "活動名稱、日期和地點為必填",
        variant: "destructive",
      });
      return;
    }

    if (!activity.area) {
      toast({
        title: "請選擇地區",
        description: "請選擇活動所在地區",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "請先登入",
        description: "您需要登入才能建立活動",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 組合日期時間
      const startDateTime = `${activity.date}T${activity.startTime || "00:00"}:00`;
      const endDateTime = `${activity.date}T${activity.endTime || "23:59"}:00`;
      
      const matchData: CreateMatchRequest = {
        name: activity.title,
        court: activity.location,
        area: activity.area,
        sport: activity.sport,
        address: activity.address,
        dateTime: startDateTime,
        endDateTime: endDateTime,
        price: activity.price,
        unit: 1, // 每人
        requiredPeople: activity.maxSlots,
        maxGrade: activity.levelMax,
        minGrade: activity.levelMin,
        remark: activity.description,
      };

      console.log("Creating match:", matchData);
      await createMatch(token, matchData);
      
      setShowSuccess(true);
      toast({
        title: "活動建立成功！",
        description: "你的活動已成功建立，等待球友報名中",
      });
    } catch (err) {
      console.error("Failed to create match:", err);
      toast({
        title: "建立失敗",
        description: err instanceof Error ? err.message : "建立活動時發生錯誤",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 md:py-12 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
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
                  <SportBadge sport={activity.sportType} size="sm" />
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
                  sport: sports.length > 0 ? sports[0].value : 1,
                  sportType: sports.length > 0 ? (sportValueToType[sports[0].value] || "badminton") : "badminton",
                  area: 0,
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
                    {sports.map((sport) => {
                      const sportType = sportValueToType[sport.value];
                      const config = sportType ? sportConfig[sportType] : null;
                      return (
                        <Button
                          key={sport.value}
                          type="button"
                          variant={activity.sport === sport.value ? "default" : "outline"}
                          size="sm"
                          className="gap-1"
                          onClick={() => handleSportChange(sport.value)}
                        >
                          {config && <span>{config.emoji}</span>}
                          <span>{sport.displayName}</span>
                        </Button>
                      );
                    })}
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

                {/* Area Selection */}
                <div className="space-y-2">
                  <Label htmlFor="area">活動地區 *</Label>
                  <Select
                    value={activity.area ? String(activity.area) : ""}
                    onValueChange={(value) => setActivity({ ...activity, area: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇地區" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.value} value={String(area.value)}>
                          {area.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    {(() => {
                      const currentSport = sports.find(s => s.value === activity.sport);
                      const grades = currentSport?.validGrades || [];
                      const minGrade = grades.length > 0 ? Math.min(...grades) : 1;
                      const maxGrade = grades.length > 0 ? Math.max(...grades) : 8;
                      return (
                        <>
                          <Slider
                            value={[activity.levelMin, activity.levelMax]}
                            onValueChange={([min, max]) => setActivity({ ...activity, levelMin: min, levelMax: max })}
                            min={minGrade}
                            max={maxGrade}
                            step={1}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>L{minGrade}</span>
                            <span>L{maxGrade}</span>
                          </div>
                        </>
                      );
                    })()}
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
                      <SportBadge sport={activity.sportType} size="sm" />
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
                        <span>
                          {areas.find(a => a.value === activity.area)?.displayName || "選擇地區"} 
                          {activity.location ? ` - ${activity.location}` : ""}
                        </span>
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
