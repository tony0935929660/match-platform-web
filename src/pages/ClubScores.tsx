import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Search,
  Download,
  MoreVertical,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Trash2,
  X,
  UserPlus,
  Loader2
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getMatches, MatchResponse, getMatch } from "@/services/matchApi";
import { getGroups } from "@/services/groupApi";
import { createScoreRecord, ScoreRecordRequest, getScoreRecords, deleteScoreRecord, ScoreRecordResponse } from "@/services/scoreApi";

// Mapping for sport ID to SportBadge type
const sportValueToType: Record<number, SportType> = {
  1: "badminton",
  2: "tennis",
  3: "basketball",
  4: "volleyball",
  5: "table-tennis",
  6: "soccer",
};

// Mock rankings (keep for now as we don't have API for stats)
const mockRankings = [
  { rank: 1, name: "林小芳", wins: 12, losses: 2, winRate: "85.7%" },
  { rank: 2, name: "王小明", wins: 10, losses: 3, winRate: "76.9%" },
  { rank: 3, name: "李大華", wins: 9, losses: 4, winRate: "69.2%" },
  { rank: 4, name: "陳美玲", wins: 7, losses: 5, winRate: "58.3%" },
  { rank: 5, name: "黃志強", wins: 6, losses: 6, winRate: "50.0%" },
];

const matchTypeOptions = [
  { value: "1v1", label: "單打 (1v1)", teamSize: 1 },
  { value: "2v2", label: "雙打 (2v2)", teamSize: 2 },
  { value: "3v3", label: "3v3", teamSize: 3 },
  { value: "4v4", label: "4v4", teamSize: 4 },
  { value: "5v5", label: "5v5", teamSize: 5 },
  { value: "6v6", label: "6v6", teamSize: 6 },
  { value: "custom", label: "自訂人數", teamSize: 0 },
];

interface ScoreEntry {
  id: string;
  matchType: string;
  customTeamSize: number;
  teamA: string[];
  teamB: string[];
  scoreA: string;
  scoreB: string;
}

const getSportType = (id: number): SportType => {
  switch (id) {
    case 1: return "badminton";
    case 2: return "tennis";
    case 3: return "table-tennis";
    case 4: return "basketball";
    case 5: return "volleyball";
    case 6: return "soccer";
    default: return "badminton";
  }
};

export default function ClubScores() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramGroupId = searchParams.get("groupId");
  const queryClient = useQueryClient();

  // Fetch groups to determine ID if missing
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroups(token!),
    enabled: !!token,
  });

  const groupId = paramGroupId || (groups && groups.length > 0 ? groups[0].id.toString() : null);

  // Update URL if using default group
  useEffect(() => {
    if (!paramGroupId && groupId) {
      setSearchParams({ groupId }, { replace: true });
    }
  }, [paramGroupId, groupId, setSearchParams]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<MatchResponse | null>(null);
  const [showAddScores, setShowAddScores] = useState(false);
  const [addingToActivity, setAddingToActivity] = useState<MatchResponse | null>(null);
  const [activityParticipants, setActivityParticipants] = useState<any[]>([]); // Store fetched participants
  const [scoreEntries, setScoreEntries] = useState<ScoreEntry[]>([
    { id: "1", matchType: "1v1", customTeamSize: 1, teamA: [], teamB: [], scoreA: "", scoreB: "" }
  ]);

  // Fetch matches
  const { data: matchesPage, isLoading } = useQuery({
    queryKey: ['matches', groupId],
    queryFn: () => getMatches(token!, { groupId: Number(groupId), pageSize: 100 }),
    enabled: !!token && !!groupId,
  });

  const matches = matchesPage?.content || [];

  // Filter matches
  const filteredActivities = matches
    .filter(activity => {
      // Remove time restriction to ensure user can see created activities
      // const isStarted = new Date(activity.dateTime) <= new Date();
      const matchesSearch = activity.name.includes(searchQuery) || activity.dateTime.includes(searchQuery);
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  
  // Fetch scores when activity is selected
  const { data: scoreRecords, isLoading: isLoadingScores, refetch: refetchScores } = useQuery({
    queryKey: ['scores', selectedActivity?.id],
    queryFn: () => getScoreRecords(token!, selectedActivity!.id),
    enabled: !!token && !!selectedActivity,
  });

  const deleteScoreMutation = useMutation({
    mutationFn: (id: number) => deleteScoreRecord(token!, id),
    onSuccess: () => {
      toast({ title: "刪除成功" });
      refetchScores();
    },
    onError: () => {
      toast({ title: "刪除失敗", variant: "destructive" });
    }
  });

  // Need to fetch full match details when selecting for adding scores to get participants
  const fetchActivityDetails = async (activity: MatchResponse) => {
    try {
      const detailedMatch = await getMatch(token!, activity.id.toString());
      setAddingToActivity(detailedMatch);
      // Extract participants safely
      const participants = detailedMatch.participants || [];
      // Normalize participant data to a simple list of names for the UI to use
      setActivityParticipants(participants.map(p => ({
        name: p.user?.name || p.user?.lineName || p.name || p.lineName || (typeof p === 'string' ? p : "Unknown"),
        id: p.userId || p.id || (typeof p === 'string' ? p : Math.random().toString())
      })));
    } catch (e) {
      console.error("Failed to fetch match details", e);
      toast({
        title: "載入失敗",
        description: "無法取得活動參加者名單",
        variant: "destructive"
      });
    }
  };

  const handleActivityClick = async (activity: MatchResponse) => {
    try {
      // Show loading state or open dialog immediately with partial data?
      // Better to fetch then open to ensure data consistency
      const detailedMatch = await getMatch(token!, activity.id.toString());
      setSelectedActivity(detailedMatch);
    } catch (e) {
      toast({
        title: "載入詳細資料失敗",
        variant: "destructive"
      });
      // Fallback to partial data if fetch fails
      setSelectedActivity(activity);
    }
  };

  const createScoreMutation = useMutation({
    mutationFn: async (data: { matchId: number, entries: ScoreEntry[] }) => {
      // Create creation promises for all entries
      const promises = data.entries.map(entry => {
        const payload: ScoreRecordRequest = {
          matchId: data.matchId,
          teamAName: entry.teamA.join(" & "), // Join names for API
          teamBName: entry.teamB.join(" & "),
          teamAScore: Number(entry.scoreA),
          teamBScore: Number(entry.scoreB)
        };
        return createScoreRecord(token!, payload);
      });
      return Promise.all(promises);
    },
    onSuccess: (results) => {
      toast({
        title: "儲存成功",
        description: `已新增 ${results.length} 筆比賽紀錄`,
      });
      setShowAddScores(false);
      setAddingToActivity(null);
      setScoreEntries([{ id: "1", matchType: "1v1", customTeamSize: 1, teamA: [], teamB: [], scoreA: "", scoreB: "" }]);
      queryClient.invalidateQueries({ queryKey: ['matches', groupId] });
      queryClient.invalidateQueries({ queryKey: ['scores', data.matchId] });
    },
    onError: (error: Error) => {
      toast({
        title: "儲存失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const totalMatches = 0; // matches.reduce((sum, a) => sum + (a.scoreCount || 0), 0); // Need API support for correct count

  const getTeamSize = (entry: ScoreEntry) => {
    if (entry.matchType === "custom") return entry.customTeamSize;
    return matchTypeOptions.find(o => o.value === entry.matchType)?.teamSize || 1;
  };

  const handleAddScoreRow = () => {
    setScoreEntries([
      ...scoreEntries,
      { id: Date.now().toString(), matchType: "1v1", customTeamSize: 1, teamA: [], teamB: [], scoreA: "", scoreB: "" }
    ]);
  };

  const handleRemoveScoreRow = (id: string) => {
    if (scoreEntries.length > 1) {
      setScoreEntries(scoreEntries.filter(entry => entry.id !== id));
    }
  };

  const handleScoreChange = (id: string, field: keyof ScoreEntry, value: string | string[] | number) => {
    setScoreEntries(scoreEntries.map(entry => {
      if (entry.id !== id) return entry;
      
      // Reset teams when match type changes
      if (field === "matchType" && typeof value === "string") {
        return { ...entry, matchType: value, teamA: [], teamB: [] };
      }
      
      if (field === "customTeamSize" && typeof value === "number") {
        return { ...entry, customTeamSize: value };
      }
      
      if ((field === "scoreA" || field === "scoreB") && typeof value === "string") {
        return { ...entry, [field]: value };
      }
      
      return entry;
    }));
  };

  const handleAddPlayerToTeam = (entryId: string, team: "teamA" | "teamB", playerName: string) => {
    setScoreEntries(scoreEntries.map(entry => {
      if (entry.id !== entryId) return entry;
      const teamSize = getTeamSize(entry);
      if (entry[team].length >= teamSize) return entry;
      if (entry[team].includes(playerName)) return entry;
      // Don't allow same player in both teams
      const otherTeam = team === "teamA" ? "teamB" : "teamA";
      if (entry[otherTeam].includes(playerName)) return entry;
      return { ...entry, [team]: [...entry[team], playerName] };
    }));
  };

  const handleRemovePlayerFromTeam = (entryId: string, team: "teamA" | "teamB", playerName: string) => {
    setScoreEntries(scoreEntries.map(entry => {
      if (entry.id !== entryId) return entry;
      return { ...entry, [team]: entry[team].filter(p => p !== playerName) };
    }));
  };

  const handleOpenAddScores = (activity: MatchResponse) => {
    fetchActivityDetails(activity);
    setScoreEntries([{ id: "1", matchType: "1v1", customTeamSize: 1, teamA: [], teamB: [], scoreA: "", scoreB: "" }]);
    setShowAddScores(true);
  };

  const handleSaveScores = () => {
    const validEntries = scoreEntries.filter(entry => {
      const teamSize = getTeamSize(entry);
      return entry.teamA.length === teamSize && 
             entry.teamB.length === teamSize && 
             entry.scoreA && 
             entry.scoreB;
    });
    
    if (validEntries.length === 0) {
      toast({
        title: "請填寫至少一筆完整的比賽紀錄",
        description: "確保每隊人數符合比賽類型並填入分數",
        variant: "destructive",
      });
      return;
    }

    if (addingToActivity) {
      createScoreMutation.mutate({ matchId: addingToActivity.id, entries: validEntries });
    }
  };

  const formatTeamDisplay = (team: string[]) => {
    if (team.length <= 2) return team.join(" / ");
    return `${team.slice(0, 2).join("、")} +${team.length - 2}`;
  };

  const getAvailablePlayers = (entry: ScoreEntry) => {
    if (!addingToActivity) return [];
    return activityParticipants.filter(
      p => !entry.teamA.includes(p.name) && !entry.teamB.includes(p.name)
    );
  };

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/club">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">計分紀錄</h1>
            <p className="text-muted-foreground mt-1">以活動為單位查看比賽分數</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            匯出 CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{matches?.length || 0}</div>
              <div className="text-sm text-muted-foreground">有紀錄的活動</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{totalMatches}</div>
              <div className="text-sm text-muted-foreground">總比賽場次</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">5</div>
              <div className="text-sm text-muted-foreground">參與計分成員</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">林小芳</div>
              <div className="text-sm text-muted-foreground">本月 MVP</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activities">活動紀錄</TabsTrigger>
            <TabsTrigger value="rankings">排行榜</TabsTrigger>
          </TabsList>

          <TabsContent value="activities">
            {/* Search */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋活動..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {filteredActivities?.map((activity) => (
                <Card
                  key={activity.id}
                  className="cursor-pointer hover:shadow-card-hover transition-all"
                  onClick={() => handleActivityClick(activity)}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <SportBadge sport={sportValueToType[activity.sport] || "badminton"} size="sm" />
                        </div>
                        <h3 className="font-semibold text-foreground text-lg mb-2">{activity.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(activity.dateTime).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(activity.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {activity.address}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {activity.participants?.length || 0} 人參與
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAddScores(activity);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          新增比賽
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rankings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  成員排行榜
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRankings.map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          player.rank === 1 ? "bg-yellow-500 text-white" :
                          player.rank === 2 ? "bg-gray-400 text-white" :
                          player.rank === 3 ? "bg-amber-600 text-white" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {player.rank}
                        </div>
                        <div className="font-medium text-foreground">{player.name}</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="font-semibold text-primary">{player.wins}</div>
                          <div className="text-xs text-muted-foreground">勝</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-destructive">{player.losses}</div>
                          <div className="text-xs text-muted-foreground">敗</div>
                        </div>
                        <div className="text-center min-w-[60px]">
                          <div className="font-semibold text-foreground">{player.winRate}</div>
                          <div className="text-xs text-muted-foreground">勝率</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Activity Detail Dialog */}
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedActivity && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <SportBadge sport={sportValueToType[selectedActivity.sport] || "badminton"} size="sm" />
                    {selectedActivity.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedActivity.dateTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(selectedActivity.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedActivity.address}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">比賽紀錄</h4>
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        setSelectedActivity(null);
                        handleOpenAddScores(selectedActivity);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      新增比賽
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {isLoadingScores ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : scoreRecords && scoreRecords.length > 0 ? (
                      scoreRecords.map((record) => (
                        <div key={record.id} className="p-3 rounded-lg border bg-card flex justify-between items-center group">
                          <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                            <div className="text-right font-medium text-sm truncate" title={record.teamAName}>
                              {record.teamAName}
                            </div>
                            <div className="dark:bg-secondary/50 bg-secondary px-3 py-1 rounded text-lg font-bold whitespace-nowrap">
                              {record.teamAScore} : {record.teamBScore}
                            </div>
                            <div className="text-left font-medium text-sm truncate" title={record.teamBName}>
                               {record.teamBName}
                            </div>
                          </div>
                          <Button
                             variant="ghost" 
                             size="icon" 
                             className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-muted-foreground hover:text-destructive"
                             onClick={() => deleteScoreMutation.mutate(record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>尚無比賽紀錄</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-foreground mb-3">參與成員 ({selectedActivity.participants?.length || 0})</h4>
                    <div className="flex flex-wrap gap-2">
                    {/* Assuming participants is array of {id, name} or similar. If not, safe access */}
                      {selectedActivity.participants?.map((p: any, i: number) => (
                        <Badge key={p.id || i} variant="secondary">{p.name || p}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Batch Add Scores Dialog */}
        <Dialog open={showAddScores} onOpenChange={setShowAddScores}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增比賽紀錄</DialogTitle>
            </DialogHeader>
            {addingToActivity && (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-2 mb-2">
                    <SportBadge sport={sportValueToType[addingToActivity.sport] || "badminton"} size="sm" />
                    <span className="font-semibold text-foreground">{addingToActivity.name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(addingToActivity.dateTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {activityParticipants.length} 人參與
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">比賽紀錄</h4>
                    {/* Add button moved to bottom */}
                  </div>

                  <div className="space-y-6">
                    {scoreEntries.map((entry, index) => {
                      const teamSize = getTeamSize(entry);
                      const availablePlayers = getAvailablePlayers(entry);
                      
                      return (
                        <div key={entry.id} className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-medium text-foreground">第 {index + 1} 場</span>
                            <div className="flex items-center gap-2">
                              <Select
                                value={entry.matchType}
                                onValueChange={(value) => handleScoreChange(entry.id, "matchType", value)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {matchTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              {entry.matchType === "custom" && (
                                <Input
                                  type="number"
                                  min={1}
                                  max={20}
                                  value={entry.customTeamSize}
                                  onChange={(e) => handleScoreChange(entry.id, "customTeamSize", parseInt(e.target.value) || 1)}
                                  className="w-20"
                                  placeholder="人數"
                                />
                              )}
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveScoreRow(entry.id)}
                                disabled={scoreEntries.length === 1}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-start">
                            {/* Team A */}
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">
                                隊伍 A ({entry.teamA.length}/{teamSize})
                              </Label>
                              <div className="min-h-[60px] p-3 rounded-lg bg-secondary">
                                <div className="flex flex-wrap gap-2">
                                  {entry.teamA.map((player) => (
                                    <Badge key={player} variant="default" className="gap-1 pr-1">
                                      {player}
                                      <button
                                        onClick={() => handleRemovePlayerFromTeam(entry.id, "teamA", player)}
                                        className="ml-1 hover:bg-primary-foreground/20 rounded p-0.5"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                  {entry.teamA.length < teamSize && (
                                    <Select
                                      onValueChange={(value) => handleAddPlayerToTeam(entry.id, "teamA", value)}
                                    >
                                      <SelectTrigger className="w-auto h-7 px-2 text-xs gap-1">
                                        <UserPlus className="h-3 w-3" />
                                        <span>加入</span>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availablePlayers.map((p) => (
                                          <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Score */}
                            <div className="flex items-end gap-2 justify-center pb-3">
                              <div className="space-y-1">
                                <Label className="text-xs text-center block">分數</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={999}
                                  value={entry.scoreA}
                                  onChange={(e) => handleScoreChange(entry.id, "scoreA", e.target.value)}
                                  className="w-16 text-center text-lg font-bold"
                                />
                              </div>
                              <span className="text-xl text-muted-foreground pb-1">:</span>
                              <div className="space-y-1">
                                <Label className="text-xs text-center block opacity-0">分數</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={999}
                                  value={entry.scoreB}
                                  onChange={(e) => handleScoreChange(entry.id, "scoreB", e.target.value)}
                                  className="w-16 text-center text-lg font-bold"
                                />
                              </div>
                            </div>

                            {/* Team B */}
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">
                                隊伍 B ({entry.teamB.length}/{teamSize})
                              </Label>
                              <div className="min-h-[60px] p-3 rounded-lg bg-secondary">
                                <div className="flex flex-wrap gap-2">
                                  {entry.teamB.map((player) => (
                                    <Badge key={player} variant="default" className="gap-1 pr-1">
                                      {player}
                                      <button
                                        onClick={() => handleRemovePlayerFromTeam(entry.id, "teamB", player)}
                                        className="ml-1 hover:bg-primary-foreground/20 rounded p-0.5"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                  {entry.teamB.length < teamSize && (
                                    <Select
                                      onValueChange={(value) => handleAddPlayerToTeam(entry.id, "teamB", value)}
                                    >
                                      <SelectTrigger className="w-auto h-7 px-2 text-xs gap-1">
                                        <UserPlus className="h-3 w-3" />
                                        <span>加入</span>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availablePlayers.map((p) => (
                                          <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleAddScoreRow} className="gap-2">
                      <Plus className="h-4 w-4" />
                      新增一場
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowAddScores(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSaveScores}>
                    儲存全部 ({scoreEntries.filter(e => {
                      const size = getTeamSize(e);
                      return e.teamA.length === size && e.teamB.length === size && e.scoreA && e.scoreB;
                    }).length} 筆)
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
