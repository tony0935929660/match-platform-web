import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMatch, MatchResponse } from "@/services/matchApi";

// Mock data for waiting list since API might not return it yet
const MOCK_WAITING_LIST = [
  {
    id: 101,
    name: "Waiting User 1",
    avatar: "/placeholder.svg",
    status: "waiting",
    joinTime: "2024-02-10T10:30:00",
  },
  {
    id: 102,
    name: "Waiting User 2",
    avatar: "/placeholder.svg",
    status: "waiting",
    joinTime: "2024-02-10T11:00:00",
  }
];

export default function ClubActivityParticipants() {
  const { id } = useParams();
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [match, setMatch] = useState<MatchResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !token) return;
      try {
        const matchData = await getMatch(token, id);
        setMatch(matchData);
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
    fetchData();
  }, [id, token]);

  const handleConfirmListAndGenerateRecords = () => {
    toast({
      title: "功能開發中",
      description: "確認名單並產生收款紀錄 API 尚未串接",
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!match) return null;

  // Assuming match.participants contains the main list
  // If waiting list is separate, we'd filter or fetch it here.
  // For now, using mock data for waiting list as requested.
  const mainList = match.participants || [];
  const waitingList = MOCK_WAITING_LIST; // Replace with match.waitingList if available later

  return (
    <MainLayout>
      <div className="container max-w-4xl py-6 md:py-10">
        <div className="mb-6">
          <Link to="/club/activities">
            <Button variant="ghost" className="pl-0 gap-2 mb-4 hover:bg-transparent hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              返回活動列表
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{match.name} - 報名管理</h1>
              <p className="text-muted-foreground mt-1">
                {new Date(match.dateTime).toLocaleDateString()} {new Date(match.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            <Button onClick={handleConfirmListAndGenerateRecords} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              確認名單並產生收款紀錄
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Main Participant List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                正式名單 
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({mainList.length} / {match.requiredPeople ? match.requiredPeople : "不限"})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mainList.length > 0 ? (
                <div className="divide-y">
                  {mainList.map((participant: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{participant.name || "未知名稱"}</div>
                          <div className="text-xs text-muted-foreground">
                            {participant.role === 1 ? "主辦人" : "參加者"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>查看個人檔案</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">移除名單</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  尚無人報名
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waiting List - Only show if waiting list management is needed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                候補名單
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({waitingList.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
               {waitingList.length > 0 ? (
                <div className="divide-y">
                  {waitingList.map((waiter) => (
                    <div key={waiter.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={waiter.avatar} />
                          <AvatarFallback>{waiter.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{waiter.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(waiter.joinTime).toLocaleString()} 排入
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                            加入正式名單
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  目前無人排隊為候補
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
