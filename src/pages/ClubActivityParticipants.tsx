import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getMatch, MatchResponse, generateUnpaidRecords } from "@/services/matchApi";

export default function ClubActivityParticipants() {
  const { id } = useParams();
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleConfirmListAndGenerateRecords = async () => {
    if (!id || !token) return;
    
    setIsSubmitting(true);
    try {
      await generateUnpaidRecords(token, id);
      toast({
        title: "成功",
        description: "已確認名單並產生收款紀錄",
      });
    } catch (error) {
      console.error("Failed to generate unpaid records", error);
      toast({
        title: "操作失敗",
        description: error instanceof Error ? error.message : "產生收款紀錄時發生錯誤",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  // Process participants based on requiredPeople
  const allParticipants = match.participants || [];
  let mainList: any[] = [];
  let waitingList: any[] = [];

  // Assuming participants are strings (names) based on new API payload
  // Map them to objects for easier rendering
  const mappedParticipants = allParticipants.map((p, index) => ({
    name: typeof p === 'string' ? p : p.name, // Handle string or object
    avatar: "/placeholder.svg", // Default
    role: 2, // Default participant
    id: index // Temporary ID
  }));

  if (match.requiredPeople === null || match.requiredPeople === undefined || match.requiredPeople === 0) {
    // Unlimited spots, everyone is in main list
    mainList = mappedParticipants;
  } else {
    // Limited spots
    mainList = mappedParticipants.slice(0, match.requiredPeople);
    waitingList = mappedParticipants.slice(match.requiredPeople);
  }

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
            <Button onClick={handleConfirmListAndGenerateRecords} className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
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
                            {/* Simple role logic, can be improved if API provides more info */}
                            參加者
                          </div>
                        </div>
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

          {/* Waiting List */}
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
                  {waitingList.map((waiter, index) => (
                    <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={waiter.avatar} />
                          <AvatarFallback>{waiter.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{waiter.name}</div>
                          <div className="text-xs text-muted-foreground">
                             候補順位 {index + 1}
                          </div>
                        </div>
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
