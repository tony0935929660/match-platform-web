import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { SportBadge, SportType, sportConfig } from "@/components/ui/SportBadge";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { CreditBadge } from "@/components/ui/CreditBadge";
import { Link } from "react-router-dom";
import { getSports, SportEnum } from "@/services/enumApi";
import { getMatches, MatchResponse } from "@/services/matchApi";
import { getGroup, getGroups, GroupResponse } from "@/services/groupApi";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { 
  ArrowRight, 
  MapPin, 
  Star,
  Trophy,
  Shield,
  Users,
  Sparkles
} from "lucide-react";

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
    // hostCreditScore: 4.8,
    // hostConfidence: "high" as const,
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
    // hostCreditScore: 4.5,
    // hostConfidence: "medium" as const,
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
    // hostCreditScore: 4.2,
    // hostConfidence: "high" as const,
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
    // hostCreditScore: 4.9,
    // hostConfidence: "high" as const,
    levelRange: { min: 3, max: 5 },
    isCasualOpen: true,
    currentSlots: 8,
    maxSlots: 12,
    price: 120,
  },
];

const mockCoaches = [
  { id: "1", name: "張教練", sport: "badminton" as SportType, rating: 4.9, reviews: 128, price: 800, avatar: "" },
  { id: "2", name: "林教練", sport: "tennis" as SportType, rating: 4.7, reviews: 86, price: 1000, avatar: "" },
  { id: "3", name: "陳教練", sport: "basketball" as SportType, rating: 4.8, reviews: 64, price: 600, avatar: "" },
];

const mapSportIdToType = (id: number): SportType => {
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

const mapSportEnumToType = (enumName: string): SportType => {
  const lower = enumName.toLowerCase();
  if (lower.includes("badminton")) return "badminton";
  if (lower.includes("tennis") && !lower.includes("table")) return "tennis";
  if (lower.includes("basketball")) return "basketball";
  if (lower.includes("volleyball")) return "volleyball";
  if (lower.includes("table")) return "table-tennis";
  if (lower.includes("soccer") || lower.includes("football")) return "soccer";
  return "badminton";
};

export default function Index() {
  const { token } = useAuth();
  const [sports, setSports] = useState<SportEnum[]>([]);
  const [hotActivities, setHotActivities] = useState<any[]>([]);
  const [hotClubs, setHotClubs] = useState<GroupResponse[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedClubDetail, setSelectedClubDetail] = useState<GroupResponse | null>(null);
  const [isClubDetailLoading, setIsClubDetailLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportsData = await getSports();
        setSports(sportsData);

        // Fetch more to handle past events filtering
        const matchesResponse = await getMatches(token || undefined, { pageSize: 20 });
        
        const matched = matchesResponse.content || [];
        // Filter out past activities
        // Note: For testing purposes, if most data is in the past, you might want to remove this filter
        // or check if backend returns correct future dates.
        const now = new Date();
        
        // Filter for future matches only and sort by date (soonest first)
        const displayMatches = matched
            .filter(m => new Date(m.dateTime) > now)
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
            .slice(0, 4);

        const mappedMatches = displayMatches.map(m => {
          // Try to find sport name from sportsData
          const sportEnum = sportsData.find(s => s.value === m.sport);
          const sportType = sportEnum ? mapSportEnumToType(sportEnum.name) : "badminton";

          return {
            id: m.id.toString(),
            title: m.name,
            sport: sportType,
            date: format(new Date(m.dateTime), "MM/dd (eee)", { locale: zhTW }),
            time: `${format(new Date(m.dateTime), "HH:mm")}-${format(new Date(m.endDateTime), "HH:mm")}`,
            location: m.court,
            hostName: m.groupName || m.host || "活動主",
            // hostCreditScore: 5.0, // API 尚未實作
            // hostConfidence: "high" as const,
            levelRange: { min: m.minGrade, max: m.maxGrade },
            isCasualOpen: m.isGuestPlayerAllowed ?? false,
            currentSlots: m.participants?.length || 0,
            maxSlots: m.requiredPeople,
            price: m.price,
          };
        });
        setHotActivities(mappedMatches);

      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchHotClubs = async () => {
      try {
        const groups = await getGroups(token || undefined);
        const topClubs = [...groups]
          .sort((a, b) => b.memberCount - a.memberCount)
          .slice(0, 3);
        setHotClubs(topClubs);
      } catch (error) {
        console.error("Failed to load hot clubs", error);
        setHotClubs([]);
      }
    };

    fetchHotClubs();
  }, [token]);

  const handleClubClick = async (clubId: number) => {
    setSelectedClubId(clubId);
    setIsClubDetailLoading(true);
    try {
      const detail = await getGroup(clubId, token || undefined);
      setSelectedClubDetail(detail);
    } catch (error) {
      console.error("Failed to load club detail", error);
      setSelectedClubDetail(null);
    } finally {
      setIsClubDetailLoading(false);
    }
  };

  // Helper to get emoji safely
  const getSportEmoji = (sportName: string) => {
    const key = sportName.toLowerCase() as SportType;
    return sportConfig[key]?.emoji || "🏃";
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              找球友，就是這麼
              <span className="text-primary">簡單</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              最專業的運動揪團平台，讓你輕鬆找到志同道合的球友
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {sports.map((sport) => (
                <Link key={sport.value} to={`/activities?sport=${sport.value}`}>
                  <Button
                    variant="outline"
                    className="h-12 px-5 gap-2 rounded-full border-2 hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <span className="text-xl">{getSportEmoji(sport.name)}</span>
                    <span className="font-medium">{sport.displayName}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Hot Activities */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">熱門活動</h2>
              <p className="text-muted-foreground mt-1">探索即將舉行的運動揪團</p>
            </div>
            <Link to="/activities">
              <Button variant="ghost" className="gap-2">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(hotActivities.length > 0 ? hotActivities : mockActivities).map((activity, index) => (
              <div key={activity.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ActivityCard {...activity} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-12 bg-primary/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-background shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">信用制度保障</h3>
                <p className="text-sm text-muted-foreground">透明的信用評分系統，確保每位球友的可靠度</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-background shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">等級配對系統</h3>
                <p className="text-sm text-muted-foreground">智能等級評估，讓你找到程度相近的對手</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-background shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">球團管理工具</h3>
                <p className="text-sm text-muted-foreground">完整的團務管理功能，輕鬆經營你的球團</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaches Section - Hidden for now */}
      {/* 
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">推薦教練</h2>
              <p className="text-muted-foreground mt-1">專業認證教練，帶你提升實力</p>
            </div>
            <Link to="/coaches">
              <Button variant="ghost" className="gap-2">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockCoaches.map((coach, index) => (
              <div 
                key={coach.id} 
                className="group p-6 rounded-xl border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{coach.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {coach.name}
                    </h3>
                    <SportBadge sport={coach.sport} size="sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{coach.rating}</span>
                    <span className="text-muted-foreground text-sm">({coach.reviews})</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">${coach.price}</div>
                    <div className="text-xs text-muted-foreground">/ 小時</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Clubs Section */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">熱門球團</h2>
              <p className="text-muted-foreground mt-1">加入球團，認識更多球友</p>
            </div>
            <Link to="/club">
              <Button variant="ghost" className="gap-2">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotClubs.map((club, index) => {
              const sportType = mapSportIdToType(club.sport);
              return (
                <button
                  key={club.id}
                  type="button"
                  onClick={() => handleClubClick(club.id)}
                  className="group p-6 rounded-xl border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in text-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl">{sportConfig[sportType].emoji}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {club.name}
                      </h3>
                      <SportBadge sport={sportType} size="sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{club.memberCount} 成員</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedClubId && (
            <div className="mt-6 p-6 rounded-xl border bg-card shadow-card">
              {isClubDetailLoading ? (
                <p className="text-sm text-muted-foreground">載入球團資料中...</p>
              ) : selectedClubDetail ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{selectedClubDetail.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedClubDetail.description || "尚無簡介"}</p>
                  <p className="text-sm text-muted-foreground">活動地點：{selectedClubDetail.court || "未填寫"}</p>
                  <p className="text-sm text-muted-foreground">地址：{selectedClubDetail.address || "未填寫"}</p>
                  <p className="text-sm text-muted-foreground">聯絡電話：{selectedClubDetail.phone || "未填寫"}</p>
                  <p className="text-sm text-muted-foreground">Email：{selectedClubDetail.email || "未填寫"}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">載入球團資料失敗，請稍後再試。</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 md:p-12 text-center">
            <div className="relative z-10">
              <Sparkles className="h-12 w-12 text-primary-foreground/80 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                準備好開始運動了嗎？
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
                立即加入揪團GO，與數千名球友一起享受運動的樂趣
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/activities">
                  <Button size="lg" variant="secondary" className="font-semibold">
                    瀏覽活動
                  </Button>
                </Link>
                <Link to="/club/new">
                  <Button size="lg" variant="secondary" className="font-semibold bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/30">
                    建立球團
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary-foreground/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-lg">🏸</span>
              </div>
              <span className="font-bold text-foreground">揪團GO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 揪團GO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
