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
import { Users, MapPin, Phone, Mail, Globe } from "lucide-react";

const sportTypes = [
  { value: "badminton", label: "羽球" },
  { value: "tennis", label: "網球" },
  { value: "basketball", label: "籃球" },
  { value: "volleyball", label: "排球" },
  { value: "table-tennis", label: "桌球" },
  { value: "soccer", label: "足球" },
  { value: "baseball", label: "棒球" },
  { value: "swimming", label: "游泳" },
  { value: "running", label: "跑步" },
  { value: "other", label: "其他" },
];

const ClubNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sportType: "",
    description: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sportType) {
      toast({
        title: "請填寫必要欄位",
        description: "球團名稱和運動類型為必填",
        variant: "destructive",
      });
      return;
    }

    // TODO: Submit to backend
    toast({
      title: "球團建立成功",
      description: `${formData.name} 已成功建立`,
    });
    navigate("/club");
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              建立新球團
            </CardTitle>
            <CardDescription>
              填寫以下資料來建立您的運動社團
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1">
                    球團名稱 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="例如：北區羽球社"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

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
                  <Label htmlFor="description">球團簡介</Label>
                  <Textarea
                    id="description"
                    placeholder="介紹您的球團特色、活動內容等..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>

              </div>

              {/* Contact Info */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-foreground">聯絡資訊</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    活動地點
                  </Label>
                  <Input
                    id="location"
                    placeholder="主要活動場地地址"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      聯絡電話
                    </Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="0912-345-678"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange("contactPhone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      電子郵件
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="club@example.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    網站連結
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
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
                  建立球團
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ClubNew;
