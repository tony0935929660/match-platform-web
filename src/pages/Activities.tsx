import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SportBadge, SportType, sportConfig } from "@/components/ui/SportBadge";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Calendar,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const sportTypes: SportType[] = ["badminton", "tennis", "basketball", "volleyball", "table-tennis", "soccer"];

const mockActivities = [
  {
    id: "1",
    title: "週三羽球交流賽",
    sport: "badminton" as SportType,
    date: "12/11 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    hostName: "王小明",
    hostCreditScore: 4.8,
    hostConfidence: "high" as const,
    levelRange: { min: 3, max: 5 },
    isCasualOpen: true,
    currentSlots: 6,
    maxSlots: 8,
    price: 150,
  },
  {
    id: "2",
    title: "假日網球友誼賽",
    sport: "tennis" as SportType,
    date: "12/14 (六)",
    time: "09:00-12:00",
    location: "新北市板橋網球場",
    hostName: "李大華",
    hostCreditScore: 4.5,
    hostConfidence: "medium" as const,
    levelRange: { min: 4, max: 6 },
    isCasualOpen: false,
    currentSlots: 4,
    maxSlots: 4,
    waitlistCount: 2,
    price: 200,
  },
  {
    id: "3",
    title: "籃球3v3鬥牛",
    sport: "basketball" as SportType,
    date: "12/12 (四)",
    time: "18:30-20:30",
    location: "台北市信義運動中心",
    hostName: "陳志強",
    hostCreditScore: 4.2,
    hostConfidence: "high" as const,
    levelRange: { min: 2, max: 4 },
    isCasualOpen: true,
    currentSlots: 5,
    maxSlots: 6,
    price: 100,
  },
  {
    id: "4",
    title: "排球練習團",
    sport: "volleyball" as SportType,
    date: "12/15 (日)",
    time: "14:00-17:00",
    location: "台中市北區體育館",
    hostName: "林美玲",
    hostCreditScore: 4.9,
    hostConfidence: "high" as const,
    levelRange: { min: 3, max: 5 },
    isCasualOpen: true,
    currentSlots: 8,
    maxSlots: 12,
    price: 120,
  },
  {
    id: "5",
    title: "週末羽球雙打",
    sport: "badminton" as SportType,
    date: "12/14 (六)",
    time: "15:00-18:00",
    location: "台北市中山運動中心",
    hostName: "黃小芳",
    hostCreditScore: 4.6,
    hostConfidence: "high" as const,
    levelRange: { min: 4, max: 6 },
    isCasualOpen: true,
    currentSlots: 3,
    maxSlots: 4,
    price: 180,
  },
  {
    id: "6",
    title: "桌球新手練習",
    sport: "table-tennis" as SportType,
    date: "12/13 (五)",
    time: "19:30-21:30",
    location: "新北市永和國民運動中心",
    hostName: "劉明德",
    hostCreditScore: 4.3,
    hostConfidence: "medium" as const,
    levelRange: { min: 1, max: 3 },
    isCasualOpen: true,
    currentSlots: 4,
    maxSlots: 8,
    price: 80,
  },
];

export default function Activities() {
  const [selectedSport, setSelectedSport] = useState<SportType | "all">("all");
  const [casualOnly, setCasualOnly] = useState(false);
  const [levelRange, setLevelRange] = useState([1, 8]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = mockActivities.filter((activity) => {
    if (selectedSport !== "all" && activity.sport !== selectedSport) return false;
    if (casualOnly && !activity.isCasualOpen) return false;
    if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedSport("all");
    setCasualOnly(false);
    setLevelRange([1, 8]);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedSport !== "all" || casualOnly || levelRange[0] !== 1 || levelRange[1] !== 8;

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">找活動</h1>
          <p className="text-muted-foreground mt-1">探索附近的運動揪團活動</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋活動名稱..."
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

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  篩選
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>篩選條件</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">運動類型</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedSport === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSport("all")}
                      >
                        全部
                      </Button>
                      {sportTypes.map((sport) => (
                        <Button
                          key={sport}
                          variant={selectedSport === sport ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSport(sport)}
                        >
                          {sportConfig[sport].emoji} {sportConfig[sport].label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">等級範圍</Label>
                    <Slider
                      value={levelRange}
                      onValueChange={setLevelRange}
                      min={1}
                      max={8}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>L{levelRange[0]}</span>
                      <span>L{levelRange[1]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="casual"
                      checked={casualOnly}
                      onCheckedChange={(checked) => setCasualOnly(checked === true)}
                    />
                    <Label htmlFor="casual" className="text-sm cursor-pointer">
                      只顯示開放臨打
                    </Label>
                  </div>

                  <div className="pt-4 border-t flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={clearFilters}>
                      清除篩選
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Sport Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
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
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">已套用篩選：</span>
            {selectedSport !== "all" && (
              <Button
                variant="secondary"
                size="sm"
                className="h-7 gap-1"
                onClick={() => setSelectedSport("all")}
              >
                {sportConfig[selectedSport].emoji} {sportConfig[selectedSport].label}
                <X className="h-3 w-3" />
              </Button>
            )}
            {casualOnly && (
              <Button
                variant="secondary"
                size="sm"
                className="h-7 gap-1"
                onClick={() => setCasualOnly(false)}
              >
                開放臨打
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-muted-foreground"
              onClick={clearFilters}
            >
              清除全部
            </Button>
          </div>
        )}

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            共找到 <span className="font-medium text-foreground">{filteredActivities.length}</span> 個活動
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredActivities.map((activity, index) => (
            <div key={activity.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <ActivityCard {...activity} />
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">找不到符合的活動</h3>
            <p className="text-muted-foreground mb-4">試試調整篩選條件或清除篩選</p>
            <Button variant="outline" onClick={clearFilters}>
              清除篩選條件
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
