import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Search,
  Download,
  MoreVertical,
  Trophy,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockScores = [
  { id: "1", date: "2024/12/04", player1: "王小明", player2: "李大華", score1: 21, score2: 18, type: "singles" },
  { id: "2", date: "2024/12/04", player1: "陳美玲", player2: "黃志強", score1: 21, score2: 15, type: "singles" },
  { id: "3", date: "2024/12/04", player1: "林小芳", player2: "張明德", score1: 21, score2: 12, type: "singles" },
  { id: "4", date: "2024/11/27", player1: "王小明/李大華", player2: "陳美玲/黃志強", score1: 21, score2: 19, type: "doubles" },
  { id: "5", date: "2024/11/27", player1: "林小芳", player2: "王小明", score1: 18, score2: 21, type: "singles" },
  { id: "6", date: "2024/11/20", player1: "李大華", player2: "張明德", score1: 21, score2: 10, type: "singles" },
];

const mockRankings = [
  { rank: 1, name: "林小芳", wins: 12, losses: 2, winRate: "85.7%" },
  { rank: 2, name: "王小明", wins: 10, losses: 3, winRate: "76.9%" },
  { rank: 3, name: "李大華", wins: 9, losses: 4, winRate: "69.2%" },
  { rank: 4, name: "陳美玲", wins: 7, losses: 5, winRate: "58.3%" },
  { rank: 5, name: "黃志強", wins: 6, losses: 6, winRate: "50.0%" },
];

export default function ClubScores() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredScores = mockScores.filter(score => 
    score.player1.includes(searchQuery) || score.player2.includes(searchQuery)
  );

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
            <p className="text-muted-foreground mt-1">查看比賽分數與排名</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              匯出 CSV
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新增比賽
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{mockScores.length}</div>
              <div className="text-sm text-muted-foreground">總比賽場次</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {mockScores.filter(s => s.type === "singles").length}
              </div>
              <div className="text-sm text-muted-foreground">單打</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {mockScores.filter(s => s.type === "doubles").length}
              </div>
              <div className="text-sm text-muted-foreground">雙打</div>
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
        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="matches">比賽紀錄</TabsTrigger>
            <TabsTrigger value="rankings">排行榜</TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋選手..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                篩選
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>比賽紀錄</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredScores.map((score) => (
                    <div key={score.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <div className="text-sm text-muted-foreground min-w-[80px]">{score.date}</div>
                      <div className="flex items-center gap-4 flex-1 justify-center">
                        <div className="text-right min-w-[120px]">
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
                        <div className="text-left min-w-[120px]">
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
                </div>
              </CardContent>
            </Card>
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
      </div>
    </MainLayout>
  );
}
