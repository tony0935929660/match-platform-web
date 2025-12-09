import { useState } from "react";
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
  UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// Mock activities with registered participants
const mockActivitiesWithScores = [
  {
    id: "1",
    title: "週三羽球交流賽",
    sport: "badminton" as SportType,
    date: "12/04 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    participants: [
      { id: "p1", name: "王小明" },
      { id: "p2", name: "李大華" },
      { id: "p3", name: "陳美玲" },
      { id: "p4", name: "黃志強" },
      { id: "p5", name: "林小芳" },
      { id: "p6", name: "張明德" },
    ],
    scores: [
      { id: "s1", teamA: ["王小明"], teamB: ["李大華"], scoreA: 21, scoreB: 18, type: "1v1" },
      { id: "s2", teamA: ["陳美玲", "黃志強"], teamB: ["林小芳", "張明德"], scoreA: 21, scoreB: 15, type: "2v2" },
      { id: "s3", teamA: ["林小芳"], teamB: ["王小明"], scoreA: 21, scoreB: 12, type: "1v1" },
    ],
    matchCount: 3,
  },
  {
    id: "2",
    title: "週六籃球3v3鬥牛",
    sport: "basketball" as SportType,
    date: "11/30 (六)",
    time: "15:00-18:00",
    location: "台北市中山運動中心",
    participants: [
      { id: "p1", name: "王小明" },
      { id: "p2", name: "李大華" },
      { id: "p3", name: "陳美玲" },
      { id: "p4", name: "黃志強" },
      { id: "p5", name: "林小芳" },
      { id: "p6", name: "張明德" },
    ],
    scores: [
      { id: "s4", teamA: ["王小明", "李大華", "陳美玲"], teamB: ["黃志強", "林小芳", "張明德"], scoreA: 21, scoreB: 19, type: "3v3" },
    ],
    matchCount: 1,
  },
  {
    id: "3",
    title: "排球友誼賽",
    sport: "volleyball" as SportType,
    date: "11/27 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    participants: [
      { id: "p1", name: "王小明" },
      { id: "p2", name: "李大華" },
      { id: "p3", name: "陳美玲" },
      { id: "p4", name: "黃志強" },
      { id: "p5", name: "林小芳" },
      { id: "p6", name: "張明德" },
      { id: "p7", name: "周美麗" },
      { id: "p8", name: "吳建國" },
      { id: "p9", name: "劉雅琪" },
      { id: "p10", name: "許志豪" },
      { id: "p11", name: "蔡宜君" },
      { id: "p12", name: "鄭大同" },
    ],
    scores: [
      { id: "s5", teamA: ["王小明", "李大華", "陳美玲", "黃志強", "林小芳", "張明德"], teamB: ["周美麗", "吳建國", "劉雅琪", "許志豪", "蔡宜君", "鄭大同"], scoreA: 25, scoreB: 21, type: "6v6" },
    ],
    matchCount: 1,
  },
];

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

export default function ClubScores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<typeof mockActivitiesWithScores[0] | null>(null);
  const [showAddScores, setShowAddScores] = useState(false);
  const [addingToActivity, setAddingToActivity] = useState<typeof mockActivitiesWithScores[0] | null>(null);
  const [scoreEntries, setScoreEntries] = useState<ScoreEntry[]>([
    { id: "1", matchType: "1v1", customTeamSize: 1, teamA: [], teamB: [], scoreA: "", scoreB: "" }
  ]);

  const filteredActivities = mockActivitiesWithScores.filter(activity =>
    activity.title.includes(searchQuery) || activity.date.includes(searchQuery)
  );

  const totalMatches = mockActivitiesWithScores.reduce((sum, a) => sum + a.matchCount, 0);

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

  const handleOpenAddScores = (activity: typeof mockActivitiesWithScores[0]) => {
    setAddingToActivity(activity);
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

    toast({
      title: "儲存成功",
      description: `已新增 ${validEntries.length} 筆比賽紀錄`,
    });
    setShowAddScores(false);
    setAddingToActivity(null);
  };

  const formatTeamDisplay = (team: string[]) => {
    if (team.length <= 2) return team.join(" / ");
    return `${team.slice(0, 2).join("、")} +${team.length - 2}`;
  };

  const getAvailablePlayers = (entry: ScoreEntry) => {
    if (!addingToActivity) return [];
    return addingToActivity.participants.filter(
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
              <div className="text-2xl font-bold text-foreground">{mockActivitiesWithScores.length}</div>
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
              {filteredActivities.map((activity) => (
                <Card
                  key={activity.id}
                  className="cursor-pointer hover:shadow-card-hover transition-all"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <SportBadge sport={activity.sport} size="sm" />
                          <Badge variant="secondary">{activity.matchCount} 場比賽</Badge>
                        </div>
                        <h3 className="font-semibold text-foreground text-lg mb-2">{activity.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {activity.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {activity.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {activity.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {activity.participants.length} 人參與
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
                    <SportBadge sport={selectedActivity.sport} size="sm" />
                    {selectedActivity.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {selectedActivity.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedActivity.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedActivity.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">比賽紀錄 ({selectedActivity.scores.length})</h4>
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

                  <div className="space-y-3">
                    {selectedActivity.scores.map((score, index) => (
                      <div key={score.id} className="p-4 rounded-lg bg-secondary">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{score.type}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>編輯</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">刪除</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 text-right">
                            <div className="font-medium text-foreground">
                              {score.teamA.length <= 2 
                                ? score.teamA.join(" / ")
                                : (
                                  <div className="space-y-0.5">
                                    {score.teamA.map((p, i) => (
                                      <div key={i} className="text-sm">{p}</div>
                                    ))}
                                  </div>
                                )
                              }
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background shrink-0">
                            <span className={`text-xl font-bold ${score.scoreA > score.scoreB ? "text-primary" : "text-muted-foreground"}`}>
                              {score.scoreA}
                            </span>
                            <span className="text-muted-foreground">:</span>
                            <span className={`text-xl font-bold ${score.scoreB > score.scoreA ? "text-primary" : "text-muted-foreground"}`}>
                              {score.scoreB}
                            </span>
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-foreground">
                              {score.teamB.length <= 2 
                                ? score.teamB.join(" / ")
                                : (
                                  <div className="space-y-0.5">
                                    {score.teamB.map((p, i) => (
                                      <div key={i} className="text-sm">{p}</div>
                                    ))}
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {selectedActivity.scores.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>尚無比賽紀錄</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-foreground mb-3">參與成員 ({selectedActivity.participants.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.participants.map((p) => (
                        <Badge key={p.id} variant="secondary">{p.name}</Badge>
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
                    <SportBadge sport={addingToActivity.sport} size="sm" />
                    <span className="font-semibold text-foreground">{addingToActivity.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {addingToActivity.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {addingToActivity.participants.length} 人參與
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">比賽紀錄</h4>
                    <Button variant="outline" size="sm" onClick={handleAddScoreRow} className="gap-2">
                      <Plus className="h-4 w-4" />
                      新增一場
                    </Button>
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
