import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { SportEnum, AreaEnum, getSports, getAreas } from "@/services/enumApi";
import { MatchResponse, getMatches } from "@/services/matchApi";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { SportType } from "@/components/ui/SportBadge";
import { 
  Search, 
  SlidersHorizontal, 
  Calendar,
  Plus
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
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Activities() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuth();
  
  // Data State
  const [sports, setSports] = useState<SportEnum[]>([]);
  const [areas, setAreas] = useState<AreaEnum[]>([]);
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Filter State
  const [selectedSport, setSelectedSport] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<number | "all">("all");
  const [selectedDate, setSelectedDate] = useState("");
  
  // Fetch Enums on Mount
  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const [sportsData, areasData] = await Promise.all([
          getSports(),
          getAreas()
        ]);
        setSports(sportsData);
        setAreas(areasData);
      } catch (error) {
        console.error("Failed to load enums", error);
        toast({
          title: "載入資料失敗",
          description: "無法取得運動類型或地區列表",
          variant: "destructive",
        });
      }
    };
    fetchEnums();
  }, []);

  // Sync from URL
  useEffect(() => {
    const sportParam = searchParams.get("sport");
    if (sportParam) setSelectedSport(Number(sportParam));
    
    const areaParam = searchParams.get("area");
    if (areaParam) setSelectedArea(Number(areaParam));

    const dateParam = searchParams.get("date");
    if (dateParam) setSelectedDate(dateParam);

    const keywordParam = searchParams.get("keyword");
    if (keywordParam) setSearchQuery(keywordParam);
  }, [searchParams]);

  // Fetch Matches
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          pageNumber: 0,
          pageSize: 20
        };
        
        if (selectedSport !== "all") params.sport = selectedSport;
        if (selectedArea !== "all") params.area = selectedArea;
        if (selectedDate) params.date = new Date(selectedDate).toISOString();
        if (searchQuery) params.keyword = searchQuery;

        const data = await getMatches(token || undefined, params);
        
        let allMatches: MatchResponse[] = [];
        if (data && Array.isArray(data.content)) {
            allMatches = data.content;
        } else if (Array.isArray(data)) {
            allMatches = data;
        }

        const now = new Date();
        
        // Filter out past matches
        const futureMatches = allMatches.filter(m => new Date(m.dateTime) > now);

        // Sort by closest time to now (ascending date for future events)
        futureMatches.sort((a, b) => {
             return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        });

        // Ensure we don't have duplicates or empty slots if backend pagination is weird
        // (Optional: if the user scrolls or we implement infinite scroll later)
        
        setMatches(futureMatches);
        setTotalElements(futureMatches.length);

      } catch (error) {
        console.error("Failed to fetch matches", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
        fetchMatches();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedSport, selectedArea, selectedDate, searchQuery, token]);

  // Update URL helpers
  const updateFilters = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === "all" || value === "") {
        newParams.delete(key);
    } else {
        newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSportChange = (sportId: number | "all") => {
    setSelectedSport(sportId);
    updateFilters("sport", sportId === "all" ? null : sportId.toString());
  };

  const handleAreaChange = (areaId: number | "all") => {
    setSelectedArea(areaId);
    updateFilters("area", areaId === "all" ? null : areaId.toString());
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    updateFilters("date", date || null);
  };
  
  const handleSearchChange = (val: string) => {
      setSearchQuery(val);
      updateFilters("keyword", val || null);
  };

  const clearFilters = () => {
    setSelectedSport("all");
    setSelectedArea("all");
    setSelectedDate("");
    setSearchQuery("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = selectedSport !== "all" || selectedArea !== "all" || selectedDate !== "" || searchQuery !== "";

  // Helper to map API Response to UI Card Props
  const mapMatchToCard = (match: MatchResponse) => {
    // Find sport name
    const sportEnum = sports.find(s => s.value === match.sport);
    // Rough mapping to SportType string keys
    let sportType: SportType = "badminton"; // default
    if (sportEnum) {
        const nameLower = sportEnum.name.toLowerCase();
        if (nameLower.includes("badminton")) sportType = "badminton";
        else if (nameLower.includes("tennis") && !nameLower.includes("table")) sportType = "tennis";
        else if (nameLower.includes("basketball")) sportType = "basketball";
        else if (nameLower.includes("volleyball")) sportType = "volleyball";
        else if (nameLower.includes("soccer")) sportType = "soccer";
        else if (nameLower.includes("table") || nameLower.includes("ping")) sportType = "table-tennis";
    }

    const startDate = new Date(match.dateTime);
    const endDate = new Date(match.endDateTime);
    const dateStr = format(startDate, "MM/dd (eee)");
    const timeStr = `${format(startDate, "HH:mm")}-${format(endDate, "HH:mm")}`;

    return {
        id: match.id.toString(),
        title: match.name,
        sport: sportType,
        date: dateStr,
        time: timeStr,
        location: match.court || match.address,
        hostName: match.groupName || match.host || "活動主",
        hostCreditScore: 5.0, // API missing
        hostConfidence: "high" as const, // API missing
        levelRange: { min: match.minGrade, max: match.maxGrade },
        isCasualOpen: match.isGuestPlayerAllowed ?? false,
        currentSlots: match.participants?.length || 0,
        maxSlots: match.requiredPeople,
        price: match.price
    };
  };

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">找活動</h1>
            <p className="text-muted-foreground mt-1">探索附近的運動揪團活動</p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/activities/new")}>
            <Plus className="h-4 w-4" />
            開新活動
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋活動名稱..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  進階篩選
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
                  {/* Area Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">地區</Label>
                    <Select 
                        value={selectedArea === "all" ? "all" : selectedArea.toString()} 
                        onValueChange={(v) => handleAreaChange(v === "all" ? "all" : Number(v))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="選擇地區" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部地區</SelectItem>
                            {areas.map((area) => (
                                <SelectItem key={area.value} value={area.value.toString()}>
                                    {area.displayName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">日期</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="date"
                            className="pl-10"
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                        />
                    </div>
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
            onClick={() => handleSportChange("all")}
          >
            全部
          </Button>
          {sports.map((sport) => {
             // Find matching config for icon if possible, else generic
             const nameLower = sport.name.toLowerCase();
             let icon = "🏅";
             if (nameLower.includes('badminton')) icon = "🏸";
             else if (nameLower.includes('tennis')) icon = "🎾";
             else if (nameLower.includes('basketball')) icon = "🏀";
             else if (nameLower.includes('volleyball')) icon = "🏐";
             else if (nameLower.includes('soccer')) icon = "⚽";
             else if (nameLower.includes('table')) icon = "🏓";

            return (
                <Button
                    key={sport.value}
                    variant={selectedSport === sport.value ? "default" : "outline"}
                    size="sm"
                    className="rounded-full flex-shrink-0 gap-1"
                    onClick={() => handleSportChange(sport.value)}
                >
                    <span>{icon}</span>
                    <span>{sport.displayName}</span>
                </Button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">已套用篩選：</span>
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
            共找到 <span className="font-medium text-foreground">{totalElements}</span> 個活動
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {matches.map((match, index) => (
            <div key={match.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <ActivityCard {...mapMatchToCard(match)} />
            </div>
          ))}
        </div>

        {matches.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">找不到符合的活動</h3>
            <p className="text-muted-foreground mb-4">試試調整篩選條件或清除篩選</p>
            <Button variant="outline" onClick={clearFilters}>
              清除篩選條件
            </Button>
          </div>
        )}
        
        {isLoading && (
            <div className="text-center py-16">
                <p>載入中...</p>
            </div>
        )}
      </div>
    </MainLayout>
  );
}
