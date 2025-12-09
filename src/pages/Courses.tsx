import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  GraduationCap,
  Filter,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const mockCourses = [
  {
    id: "1",
    name: "羽球基礎班",
    sport: "badminton" as SportType,
    coach: "林教練",
    coachAvatar: "林",
    description: "適合初學者的羽球課程，從基本動作到實戰技巧。",
    level: 2,
    price: 800,
    duration: "2小時",
    schedule: "每週三 19:00-21:00",
    location: "台北市大安運動中心",
    currentStudents: 10,
    maxStudents: 12,
    totalSessions: 12,
    startDate: "2025/01/08",
    tags: ["初學者友善", "小班教學"],
  },
  {
    id: "2",
    name: "網球進階技術班",
    sport: "tennis" as SportType,
    coach: "王教練",
    coachAvatar: "王",
    description: "針對有基礎的學員，強化正反手技術與比賽戰術。",
    level: 4,
    price: 1200,
    duration: "2小時",
    schedule: "每週六 10:00-12:00",
    location: "台北市網球中心",
    currentStudents: 6,
    maxStudents: 8,
    totalSessions: 10,
    startDate: "2025/01/11",
    tags: ["進階技術", "戰術訓練"],
  },
  {
    id: "3",
    name: "籃球體能訓練營",
    sport: "basketball" as SportType,
    coach: "張教練",
    coachAvatar: "張",
    description: "專注於體能與基本功訓練，適合想提升實力的球友。",
    level: 3,
    price: 600,
    duration: "1.5小時",
    schedule: "每週二、四 18:30-20:00",
    location: "台北市信義運動中心",
    currentStudents: 14,
    maxStudents: 16,
    totalSessions: 16,
    startDate: "2025/01/07",
    tags: ["體能訓練", "基本功"],
  },
  {
    id: "4",
    name: "排球新手入門班",
    sport: "volleyball" as SportType,
    coach: "陳教練",
    coachAvatar: "陳",
    description: "零基礎也能學！從基本傳接球到簡單戰術配合。",
    level: 1,
    price: 500,
    duration: "2小時",
    schedule: "每週日 14:00-16:00",
    location: "台北市中山運動中心",
    currentStudents: 8,
    maxStudents: 12,
    totalSessions: 8,
    startDate: "2025/01/12",
    tags: ["零基礎OK", "週末班"],
  },
  {
    id: "5",
    name: "桌球技巧精進班",
    sport: "table-tennis" as SportType,
    coach: "李教練",
    coachAvatar: "李",
    description: "提升發球、接發球技巧，加強旋轉球處理能力。",
    level: 5,
    price: 900,
    duration: "1.5小時",
    schedule: "每週五 19:30-21:00",
    location: "台北市松山運動中心",
    currentStudents: 4,
    maxStudents: 6,
    totalSessions: 12,
    startDate: "2025/01/10",
    tags: ["技巧精進", "1對1指導"],
  },
];

const sportTypes: SportType[] = ["badminton", "tennis", "basketball", "volleyball", "table-tennis", "soccer"];

const sportConfig: Record<SportType, { emoji: string; label: string }> = {
  badminton: { emoji: "🏸", label: "羽球" },
  tennis: { emoji: "🎾", label: "網球" },
  basketball: { emoji: "🏀", label: "籃球" },
  volleyball: { emoji: "🏐", label: "排球" },
  "table-tennis": { emoji: "🏓", label: "桌球" },
  soccer: { emoji: "⚽", label: "足球" },
};

export default function Courses() {
  const [selectedSport, setSelectedSport] = useState<SportType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSport = selectedSport === "all" || course.sport === selectedSport;
    const matchesSearch = course.name.includes(searchQuery) || 
      course.coach.includes(searchQuery) || 
      course.location.includes(searchQuery);
    const matchesLevel = levelFilter === "all" || 
      (levelFilter === "beginner" && course.level <= 2) ||
      (levelFilter === "intermediate" && course.level >= 3 && course.level <= 4) ||
      (levelFilter === "advanced" && course.level >= 5);
    return matchesSport && matchesSearch && matchesLevel;
  });

  const clearFilters = () => {
    setSelectedSport("all");
    setSearchQuery("");
    setLevelFilter("all");
  };

  const hasActiveFilters = selectedSport !== "all" || searchQuery !== "" || levelFilter !== "all";

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">找課程</h1>
          <p className="text-muted-foreground">探索專業教練帶領的運動課程，提升你的技術水平</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋課程、教練或地點..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedSport} onValueChange={(v) => setSelectedSport(v as SportType | "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="運動類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部運動</SelectItem>
                {sportTypes.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sportConfig[sport].emoji} {sportConfig[sport].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="程度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部程度</SelectItem>
                <SelectItem value="beginner">初學者</SelectItem>
                <SelectItem value="intermediate">中級</SelectItem>
                <SelectItem value="advanced">進階</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sport Chips - Mobile */}
        <div className="flex gap-2 overflow-x-auto pb-4 md:hidden scrollbar-hide">
          <Button
            variant={selectedSport === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full flex-shrink-0"
            onClick={() => setSelectedSport("all")}
          >
            全部
          </Button>
          {sportTypes.map((sport) => (
            <Button
              key={sport}
              variant={selectedSport === sport ? "default" : "outline"}
              size="sm"
              className="rounded-full flex-shrink-0 gap-1"
              onClick={() => setSelectedSport(sport)}
            >
              <span>{sportConfig[sport].emoji}</span>
              <span>{sportConfig[sport].label}</span>
            </Button>
          ))}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm text-muted-foreground">篩選條件：</span>
            {selectedSport !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {sportConfig[selectedSport].emoji} {sportConfig[selectedSport].label}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSport("all")} />
              </Badge>
            )}
            {levelFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {levelFilter === "beginner" ? "初學者" : levelFilter === "intermediate" ? "中級" : "進階"}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setLevelFilter("all")} />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
              清除全部
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">
            共 {filteredCourses.length} 個課程
          </span>
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card className="h-full hover:shadow-card-hover transition-all cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                  {/* Course Header */}
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <SportBadge sport={course.sport} size="sm" />
                        <SkillLevelBadge level={course.level} size="sm" />
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">${course.price}</div>
                        <div className="text-xs text-muted-foreground">/堂</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">{course.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  </div>
                  
                  {/* Course Details */}
                  <div className="p-4 space-y-3">
                    {/* Coach */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{course.coachAvatar}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{course.coach}</span>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{course.schedule}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{course.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          <span>{course.currentStudents}/{course.maxStudents} 學員</span>
                        </div>
                        <span className="text-xs">共 {course.totalSessions} 堂</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1.5 flex-wrap">
                      {course.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        開課日期：{course.startDate}
                      </span>
                      <Button size="sm" className="gap-1">
                        報名課程
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">找不到符合條件的課程</h3>
            <p className="text-muted-foreground mb-4">試試調整篩選條件或搜尋其他關鍵字</p>
            <Button variant="outline" onClick={clearFilters}>
              清除篩選條件
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
