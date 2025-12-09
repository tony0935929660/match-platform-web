import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { GraduationCap, User, Clock, DollarSign, MapPin, Users, Calendar } from "lucide-react";

const sportTypes = [
  { value: "badminton", label: "羽球" },
  { value: "tennis", label: "網球" },
  { value: "basketball", label: "籃球" },
  { value: "volleyball", label: "排球" },
  { value: "table-tennis", label: "桌球" },
  { value: "soccer", label: "足球" },
  { value: "swimming", label: "游泳" },
  { value: "yoga", label: "瑜伽" },
  { value: "fitness", label: "健身" },
  { value: "other", label: "其他" },
];

const skillLevels = [
  { value: "beginner", label: "初學者" },
  { value: "elementary", label: "入門" },
  { value: "intermediate", label: "中級" },
  { value: "advanced", label: "進階" },
  { value: "all", label: "不限程度" },
];

const CourseNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sportType: "",
    coach: "",
    description: "",
    skillLevel: "",
    location: "",
    schedule: "",
    duration: "",
    price: "",
    maxStudents: "",
    startDate: "",
    totalSessions: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sportType || !formData.coach || !formData.price) {
      toast({
        title: "請填寫必要欄位",
        description: "課程名稱、運動類型、教練和費用為必填",
        variant: "destructive",
      });
      return;
    }

    // TODO: Submit to backend
    toast({
      title: "課程建立成功",
      description: `${formData.name} 已成功建立`,
    });
    navigate("/activities");
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              建立新課程
            </CardTitle>
            <CardDescription>
              填寫以下資料來建立您的運動課程
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1">
                    課程名稱 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="例如：初學者羽球基礎班"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sportType" className="flex items-center gap-1">
                      運動類型 <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.sportType}
                      onValueChange={(value) => handleChange("sportType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇運動類型" />
                      </SelectTrigger>
                      <SelectContent>
                        {sportTypes.map((sport) => (
                          <SelectItem key={sport.value} value={sport.value}>
                            {sport.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skillLevel">適合程度</Label>
                    <Select
                      value={formData.skillLevel}
                      onValueChange={(value) => handleChange("skillLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇程度" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coach" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    教練名稱 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="coach"
                    placeholder="教練姓名"
                    value={formData.coach}
                    onChange={(e) => handleChange("coach", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">課程介紹</Label>
                  <Textarea
                    id="description"
                    placeholder="介紹課程內容、教學方式、適合對象等..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
              </div>

              {/* Schedule & Location */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-foreground">時間與地點</h3>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    上課地點
                  </Label>
                  <Input
                    id="location"
                    placeholder="上課場地地址"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      上課時間
                    </Label>
                    <Input
                      id="schedule"
                      placeholder="例如：每週六 14:00-16:00"
                      value={formData.schedule}
                      onChange={(e) => handleChange("schedule", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">每堂時長（分鐘）</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="120"
                      value={formData.duration}
                      onChange={(e) => handleChange("duration", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      開課日期
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalSessions">總堂數</Label>
                    <Input
                      id="totalSessions"
                      type="number"
                      placeholder="8"
                      value={formData.totalSessions}
                      onChange={(e) => handleChange("totalSessions", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-foreground">費用與人數</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      課程費用（NT$） <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="3000"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxStudents" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      招生人數上限
                    </Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      placeholder="12"
                      value={formData.maxStudents}
                      onChange={(e) => handleChange("maxStudents", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  取消
                </Button>
                <Button type="submit" className="flex-1">
                  建立課程
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CourseNew;
