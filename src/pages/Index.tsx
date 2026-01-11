import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { SportBadge, SportType, sportConfig } from "@/components/ui/SportBadge";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { CreditBadge } from "@/components/ui/CreditBadge";
import { Link } from "react-router-dom";
import { getSports, SportEnum } from "@/services/enumApi";
import { useState, useEffect } from "react";
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
];

const mockCoaches = [
  { id: "1", name: "張教練", sport: "badminton" as SportType, rating: 4.9, reviews: 128, price: 800, avatar: "" },
  { id: "2", name: "林教練", sport: "tennis" as SportType, rating: 4.7, reviews: 86, price: 1000, avatar: "" },
  { id: "3", name: "陳教練", sport: "basketball" as SportType, rating: 4.8, reviews: 64, price: 600, avatar: "" },
];

const mockClubs = [
  { id: "1", name: "羽翔俱樂部", sport: "badminton" as SportType, members: 42, rating: 4.7 },
  { id: "2", name: "台北網球聯盟", sport: "tennis" as SportType, members: 28, rating: 4.5 },
  { id: "3", name: "籃球夢工廠", sport: "basketball" as SportType, members: 56, rating: 4.8 },
];

export default function Index() {
  const [sports, setSports] = useState<SportEnum[]>([]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const data = await getSports();
        setSports(data);
      } catch (error) {
        console.error("Failed to load sports", error);
      }
    };
    fetchSports();
  }, []);

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
            {mockActivities.map((activity, index) => (
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

      {/* Coaches Section */}
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

      {/* Clubs Section */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">熱門球團</h2>
              <p className="text-muted-foreground mt-1">加入球團，認識更多球友</p>
            </div>
            <Link to="/clubs">
              <Button variant="ghost" className="gap-2">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockClubs.map((club, index) => (
              <div 
                key={club.id} 
                className="group p-6 rounded-xl border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">{sportConfig[club.sport].emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {club.name}
                    </h3>
                    <SportBadge sport={club.sport} size="sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{club.members} 成員</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{club.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
