import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { getMatch } from "@/services/matchApi"; 
import { getSports, SportEnum, getAreas, AreaEnum, getBillingUnits, BillingUnitEnum } from "@/services/enumApi";

export default function ClubEditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Enums
  const [sports, setSports] = useState<SportEnum[]>([]);
  const [areas, setAreas] = useState<AreaEnum[]>([]);
  const [billingUnits, setBillingUnits] = useState<BillingUnitEnum[]>([]);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    area: "",
    court: "",
    address: "",
    date: "",
    startTime: "",
    endTime: "",
    price: "",
    unit: "1", // Default 'Per Person'
    requiredPeople: "",
    minGrade: "1",
    maxGrade: "10",
    remark: "",
    isGuestPlayerAllowed: true,
    guestPlayerJoinBeforeStartMinutes: "60",
    isScoreRecordEnabled: false,
  });

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const [sportsData, areasData, unitsData] = await Promise.all([
          getSports(),
          getAreas(),
          getBillingUnits(),
        ]);
        setSports(sportsData);
        setAreas(areasData);
        setBillingUnits(unitsData);
      } catch (error) {
        console.error("Failed to load enums", error);
      }
    };
    fetchEnums();
  }, []);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id || !token) return;
      try {
        const match = await getMatch(token, id);
        
        // Parse date and time
        const start = new Date(match.dateTime);
        const end = new Date(match.endDateTime);
        
        // Format for inputs
        const dateStr = start.toISOString().split('T')[0];
        const startTimeStr = start.toTimeString().slice(0, 5);
        const endTimeStr = end.toTimeString().slice(0, 5);

        setFormData({
          name: match.name,
          sport: match.sport.toString(),
          area: match.area.toString(),
          court: match.court,
          address: match.address,
          date: dateStr,
          startTime: startTimeStr,
          endTime: endTimeStr,
          price: match.price.toString(),
          unit: match.unit.toString(),
          requiredPeople: match.requiredPeople ? match.requiredPeople.toString() : "",
          minGrade: match.minGrade.toString(),
          maxGrade: match.maxGrade.toString(),
          remark: match.remark || "",
          isGuestPlayerAllowed: match.isGuestPlayerAllowed ?? true,
          guestPlayerJoinBeforeStartMinutes: match.guestPlayerJoinBeforeStartMinutes?.toString() || "60",
          isScoreRecordEnabled: match.isScoreRecordEnabled ?? false,
        });
      } catch (error) {
        console.error("Failed to fetch match", error);
        toast({
          title: "載入失敗",
          description: "無法取得活動資料",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, [id, token]);

  const handleSave = async () => {
    if (!token || !id) return;
    setIsSaving(true);
    
    try {
        // Construct payload
        const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`);
        const endDateTime = new Date(`${formData.date}T${formData.endTime}:00`);
        
        const payload = {
            name: formData.name,
            sport: parseInt(formData.sport),
            area: parseInt(formData.area),
            court: formData.court,
            address: formData.address,
            dateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            price: parseInt(formData.price),
            unit: parseInt(formData.unit),
            requiredPeople: formData.requiredPeople ? parseInt(formData.requiredPeople) : null,
            minGrade: parseFloat(formData.minGrade),
            maxGrade: parseFloat(formData.maxGrade),
            remark: formData.remark,
            isGuestPlayerAllowed: formData.isGuestPlayerAllowed,
            guestPlayerJoinBeforeStartMinutes: parseInt(formData.guestPlayerJoinBeforeStartMinutes),
            isScoreRecordEnabled: formData.isScoreRecordEnabled,
        };

        // Call API
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/matches/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "更新失敗");
        }

        toast({
            title: "更新成功",
            description: "活動資料已更新",
        });
        
    } catch (error) {
        console.error("Error updating match", error);
        toast({
            title: "更新失敗",
            description: error instanceof Error ? error.message : "發生錯誤",
            variant: "destructive",
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">編輯活動</h1>
            <p className="text-muted-foreground">{formData.name}</p>
          </div>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>活動資訊</CardTitle>
            <CardDescription>修改活動的基本資料與設定</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>活動名稱</Label>
                <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label>運動項目</Label>
                <Select 
                    value={formData.sport} 
                    onValueChange={(v) => setFormData({...formData, sport: v})}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="選擇運動" />
                    </SelectTrigger>
                    <SelectContent>
                    {sports.map(s => (
                        <SelectItem key={s.value} value={s.value.toString()}>{s.displayName}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
                
                <div className="space-y-2">
                <Label>地區</Label>
                <Select 
                    value={formData.area} 
                    onValueChange={(v) => setFormData({...formData, area: v})}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="選擇地區" />
                    </SelectTrigger>
                    <SelectContent>
                    {areas.map(a => (
                        <SelectItem key={a.value} value={a.value.toString()}>{a.displayName}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>場地名稱</Label>
                <Input 
                value={formData.court} 
                onChange={(e) => setFormData({...formData, court: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <Label>詳細地址</Label>
                <Input 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                <Label>日期</Label>
                <Input 
                    type="date"
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
                </div>
                <div className="space-y-2">
                <Label>開始時間</Label>
                <Input 
                    type="time"
                    value={formData.startTime} 
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                />
                </div>
                <div className="space-y-2">
                <Label>結束時間</Label>
                <Input 
                    type="time"
                    value={formData.endTime} 
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label>費用</Label>
                <Input 
                    type="number"
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
                </div>
                <div className="space-y-2">
                <Label>計費單位</Label>
                <Select 
                    value={formData.unit} 
                    onValueChange={(v) => setFormData({...formData, unit: v})}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="選擇單位" />
                    </SelectTrigger>
                    <SelectContent>
                    {billingUnits.map(u => (
                        <SelectItem key={u.value} value={u.value.toString()}>{u.displayName}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
            </div>

                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label>程度下限 (1-20)</Label>
                <Input 
                    type="number"
                    step="0.1"
                    value={formData.minGrade} 
                    onChange={(e) => setFormData({...formData, minGrade: e.target.value})}
                />
                </div>
                <div className="space-y-2">
                <Label>程度上限 (1-20)</Label>
                <Input 
                    type="number"
                    step="0.1"
                    value={formData.maxGrade} 
                    onChange={(e) => setFormData({...formData, maxGrade: e.target.value})}
                />
                </div>
            </div>

                <div className="space-y-2">
                <Label>人數上限 (空白代表不限)</Label>
                <Input 
                    type="number"
                    value={formData.requiredPeople} 
                    onChange={(e) => setFormData({...formData, requiredPeople: e.target.value})}
                    placeholder="不限"
                />
                </div>

            <div className="space-y-2">
                <Label>備註說明</Label>
                <Textarea 
                    value={formData.remark} 
                    onChange={(e) => setFormData({...formData, remark: e.target.value})}
                    className="min-h-[100px]"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="isGuestPlayerAllowed" 
                        checked={formData.isGuestPlayerAllowed}
                        onCheckedChange={(c) => setFormData({...formData, isGuestPlayerAllowed: c as boolean})}
                    />
                    <Label htmlFor="isGuestPlayerAllowed">開放非球團成員報名 (臨打)</Label>
                </div>
                
                {formData.isGuestPlayerAllowed && (
                    <div className="ml-6 space-y-2">
                        <Label>臨打報名截止時間 (活動開始前分鐘數)</Label>
                        <Input 
                            type="number"
                            value={formData.guestPlayerJoinBeforeStartMinutes} 
                            onChange={(e) => setFormData({...formData, guestPlayerJoinBeforeStartMinutes: e.target.value})}
                        />
                    </div>
                )}
            </div>
            
                <div className="flex items-center space-x-2">
                <Checkbox 
                id="isScoreRecordEnabled" 
                checked={formData.isScoreRecordEnabled}
                onCheckedChange={(c) => setFormData({...formData, isScoreRecordEnabled: c as boolean})}
                />
                <Label htmlFor="isScoreRecordEnabled">開啟計分功能</Label>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    儲存變更
                </Button>
            </div>
            </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

