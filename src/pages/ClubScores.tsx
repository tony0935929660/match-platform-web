import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { Badge } from "@/components/ui/badge";
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
  X,
  Trash2
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
      { id: "s1", player1: "王小明", player2: "李大華", score1: 21, score2: 18, type: "singles" },
      { id: "s2", player1: "陳美玲", player2: "黃志強", score1: 21, score2: 15, type: "singles" },
      { id: "s3", player1: "林小芳", player2: "張明德", score1: 21, score2: 12, type: "singles" },
    ],
    matchCount: 3,
  },
  {
    id: "2",
    title: "週六羽球雙打",
    sport: "badminton" as SportType,
    date: "11/30 (六)",
    time: "15:00-18:00",
    location: "台北市中山運動中心",
    participants: [
      { id: "p1", name: "王小明" },
      { id: "p2", name: "李大華" },
      { id: "p3", name: "陳美玲" },
      { id: "p4", name: "黃志強" },
    ],
    scores: [
      { id: "s4", player1: "王小明/李大華", player2: "陳美玲/黃志強", score1: 21, score2: 19, type: "doubles" },
    ],
    matchCount: 1,
  },
  {
    id: "3",
    title: "週三羽球練習",
    sport: "badminton" as SportType,
    date: "11/27 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    participants: [
      { id: "p1", name: "王小明" },
      { id: "p2", name: "李大華" },
      { id: "p5", name: "林小芳" },
      { id: "p6", name: "張明德" },
    ],
    scores: [
      { id: "s5", player1: "林小芳", player2: "王小明", score1: 18, score2: 21, type: "singles" },
      { id: "s6", player1: "李大華", player2: "張明德", score1: 21, score2: 10, type: "singles" },
    ],
    matchCount: 2,
  },
];

const mockRankings = [
  { rank: 1, name: "林小芳", wins: 12, losses: 2, winRate: "85.7%" },
  { rank: 2, name: "王小明", wins: 10, losses: 3, winRate: "76.9%" },
  { rank: 3, name: "李大華", wins: 9, losses: 4, winRate: "69.2%" },
  { rank: 4, name: "陳美玲", wins: 7, losses: 5, winRate: "58.3%" },
  { rank: 5, name: "黃志強", wins: 6, losses: 6, winRate: "50.0%" },
];

interface ScoreEntry {
  id: string;
  player1: string;
  player2: string;
  score1: string;
  score2: string;
}

export default function ClubScores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<typeof mockActivitiesWithScores[0] | null>(null);
  const [showAddScores, setShowAddScores] = useState(false);
  const [addingToActivity, setAddingToActivity] = useState<typeof mockActivitiesWithScores[0] | null>(null);
  const [scoreEntries, setScoreEntries] = useState<ScoreEntry[]>([
    { id: "1", player1: "", player2: "", score1: "", score2: "" }
  ]);

  const filteredActivities = mockActivitiesWithScores.filter(activity =>
    activity.title.includes(searchQuery) || activity.date.includes(searchQuery)
  );

  const totalMatches = mockActivitiesWithScores.reduce((sum, a) => sum + a.matchCount, 0);

  const handleAddScoreRow = () => {
    setScoreEntries([
      ...scoreEntries,
      { id: Date.now().toString(), player1: "", player2: "", score1: "", score2: "" }
    ]);
  };

  const handleRemoveScoreRow = (id: string) => {
    if (scoreEntries.length > 1) {
      setScoreEntries(scoreEntries.filter(entry => entry.id !== id));
    }
  };

  const handleScoreChange = (id: string, field: keyof ScoreEntry, value: string) => {
    setScoreEntries(scoreEntries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleOpenAddScores = (activity: typeof mockActivitiesWithScores[0]) => {
    setAddingToActivity(activity);
    setScoreEntries([{ id: "1", player1: "", player2: "", score1: "", score2: "" }]);
    setShowAddScores(true);
  };

  const handleSaveScores = () => {
    const validEntries = scoreEntries.filter(
      entry => entry.player1 && entry.player2 && entry.score1 && entry.score2
    );
    
    if (validEntries.length === 0) {
      toast({
        title: "請填寫至少一筆完整的比賽紀錄",
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
                      <div key={score.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                        <div className="text-sm text-muted-foreground w-8">#{index + 1}</div>
                        <div className="flex items-center gap-4 flex-1 justify-center">
                          <div className="text-right min-w-[100px]">
                            <div className="font-medium text-foreground">{score.player1}</div>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background">
                            <span className={`text-xl font-bold ${score.score1 > score.score2 ? "text-primary" : "text-muted-foreground"}`}>
                              {score.score1}
                            </span>
                            <span className="text-muted-foreground">:</span>
                            <span className={`text-xl font-bold ${score.score2 > score.score1 ? "text-primary" : "text-muted-foreground"}`}>
                              {score.score2}
                            </span>
                          </div>
                          <div className="text-left min-w-[100px]">
                            <div className="font-medium text-foreground">{score.player2}</div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>編輯</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">刪除</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
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
                      新增一列
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {/* Header */}
                    <div className="hidden md:grid grid-cols-[1fr,60px,60px,1fr,40px] gap-3 px-2 text-sm font-medium text-muted-foreground">
                      <div>選手 A</div>
                      <div className="text-center">分數</div>
                      <div className="text-center">分數</div>
                      <div>選手 B</div>
                      <div></div>
                    </div>

                    {scoreEntries.map((entry, index) => (
                      <div key={entry.id} className="grid grid-cols-1 md:grid-cols-[1fr,60px,60px,1fr,40px] gap-3 p-3 rounded-lg bg-secondary items-center">
                        <div className="md:hidden text-sm text-muted-foreground mb-1">第 {index + 1} 場</div>
                        <Select
                          value={entry.player1}
                          onValueChange={(value) => handleScoreChange(entry.id, "player1", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇選手 A" />
                          </SelectTrigger>
                          <SelectContent>
                            {addingToActivity.participants
                              .filter(p => p.name !== entry.player2)
                              .map((p) => (
                                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="分數"
                          value={entry.score1}
                          onChange={(e) => handleScoreChange(entry.id, "score1", e.target.value)}
                          className="text-center"
                          min={0}
                          max={99}
                        />
                        <Input
                          type="number"
                          placeholder="分數"
                          value={entry.score2}
                          onChange={(e) => handleScoreChange(entry.id, "score2", e.target.value)}
                          className="text-center"
                          min={0}
                          max={99}
                        />
                        <Select
                          value={entry.player2}
                          onValueChange={(value) => handleScoreChange(entry.id, "player2", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇選手 B" />
                          </SelectTrigger>
                          <SelectContent>
                            {addingToActivity.participants
                              .filter(p => p.name !== entry.player1)
                              .map((p) => (
                                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
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
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowAddScores(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSaveScores}>
                    儲存全部 ({scoreEntries.filter(e => e.player1 && e.player2 && e.score1 && e.score2).length} 筆)
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
