import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Users, MapPin, Phone, Mail, Globe, Loader2, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getSports, SportEnum } from "@/services/enumApi";
import { createGroup, CreateGroupRequest } from "@/services/groupApi";

const ClubNew = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sports, setSports] = useState<SportEnum[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    sport: 0,
    description: "",
    court: "",
    address: "",
    phone: "",
    email: "",
    websiteUrl: "",
  });

  // 載入運動類型
  useEffect(() => {
    async function loadSports() {
      try {
        const sportsData = await getSports();
        setSports(sportsData);
      } catch (err) {
        console.error("Failed to load sports:", err);
        toast({
          title: "載入失敗",
          description: "無法載入運動類型資料",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadSports();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sport) {
      toast({
        title: "請填寫必要欄位",
        description: "球團名稱和運動類型為必填",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "請先登入",
        description: "您需要登入才能建立球團",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 只傳送有值的欄位
      const groupData: CreateGroupRequest = {
        name: formData.name,
        sport: formData.sport,
      };
      
      // 可選欄位只在有值時才加入
      if (formData.description) groupData.description = formData.description;
      if (formData.court) groupData.court = formData.court;
      if (formData.address) groupData.address = formData.address;
      if (formData.phone) groupData.phone = formData.phone;
      if (formData.email) groupData.email = formData.email;
      if (formData.websiteUrl) groupData.websiteUrl = formData.websiteUrl;

      console.log("Creating group:", groupData);
      await createGroup(token, groupData);
      
      toast({
        title: "球團建立成功",
        description: `${formData.name} 已成功建立`,
      });
      navigate("/club");
    } catch (err) {
      console.error("Failed to create group:", err);
      toast({
        title: "建立失敗",
        description: err instanceof Error ? err.message : "建立球團時發生錯誤",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

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
                    value={formData.sport ? String(formData.sport) : ""}
                    onValueChange={(value) => handleChange("sport", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇運動類型" />
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
                  <Label htmlFor="court" className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    活動地點
                  </Label>
                  <Input
                    id="court"
                    placeholder="例如：台北市大安運動中心"
                    value={formData.court}
                    onChange={(e) => handleChange("court", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    活動地址
                  </Label>
                  <Input
                    id="address"
                    placeholder="例如：台北市大安區辛亥路三段55號"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      聯絡電話
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0912-345-678"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      電子郵件
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="club@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl" className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    網站連結
                  </Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.websiteUrl}
                    onChange={(e) => handleChange("websiteUrl", e.target.value)}
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
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
