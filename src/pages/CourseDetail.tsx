import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  GraduationCap,
  DollarSign,
  BookOpen,
  CheckCircle,
  Phone,
  Mail,
  Star,
  Share2,
  Heart
} from "lucide-react";

const mockCourse = {
  id: "1",
  name: "羽球基礎班",
  sport: "badminton" as SportType,
  coach: "林教練",
  coachAvatar: "林",
  coachBio: "前國家隊選手，擁有15年教學經驗，專注於基礎技術培養與動作矯正。曾指導多位學員進入校隊與業餘聯賽。",
  coachRating: 4.9,
  coachStudents: 156,
  description: "適合初學者的羽球課程，從基本動作到實戰技巧。本課程將從握拍方式、站位、基本步伐開始教起，循序漸進地帶領學員掌握羽球運動的基礎。",
  level: 2,
  price: 800,
  duration: "2小時",
  schedule: "每週三 19:00-21:00",
  location: "台北市大安運動中心",
  address: "台北市大安區信義路四段200號",
  currentStudents: 10,
  maxStudents: 12,
  totalSessions: 12,
  startDate: "2025/01/08",
  endDate: "2025/03/26",
  tags: ["初學者友善", "小班教學", "器材提供"],
  highlights: [
    "專業教練一對一指導動作",
    "提供練習用羽球拍與羽毛球",
    "小班制教學，確保學習品質",
    "課後提供練習影片複習"
  ],
  curriculum: [
    { week: 1, title: "認識羽球與基本握拍", description: "了解羽球運動特性，學習正確握拍姿勢" },
    { week: 2, title: "基本站位與移動", description: "學習羽球場上的基本站位與簡單步伐" },
    { week: 3, title: "正手發球", description: "掌握正手高遠球發球技巧" },
    { week: 4, title: "正手揮拍", description: "學習正手擊球的完整動作" },
    { week: 5, title: "反手技術入門", description: "反手握拍與基本反手擊球" },
    { week: 6, title: "網前技術", description: "學習網前搓球與放網技巧" },
    { week: 7, title: "挑球練習", description: "掌握被動情況下的挑球技術" },
    { week: 8, title: "殺球技巧", description: "學習殺球動作與發力方式" },
    { week: 9, title: "網前技術進階", description: "勾球、推球等網前變化" },
    { week: 10, title: "雙打配合基礎", description: "雙打站位與基本輪轉" },
    { week: 11, title: "實戰演練", description: "綜合練習與比賽模擬" },
    { week: 12, title: "結業賽與總複習", description: "課程總結與結業小比賽" },
  ],
  reviews: [
    { id: "1", name: "王小明", rating: 5, comment: "林教練教學非常有耐心，動作講解清楚，很適合初學者！", date: "2024/11/20" },
    { id: "2", name: "李美玲", rating: 5, comment: "上完課後進步很多，現在已經可以跟朋友打比賽了。", date: "2024/10/15" },
    { id: "3", name: "陳志強", rating: 4, comment: "場地很好，教練也很專業，只是希望能多一些對打練習時間。", date: "2024/09/28" },
  ]
};

export default function CourseDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    name: "",
    phone: "",
    email: "",
    note: ""
  });
  const [isFavorite, setIsFavorite] = useState(false);

  const handleEnroll = () => {
    if (!enrollForm.name || !enrollForm.phone) {
      toast({
        title: "請填寫必要資訊",
        description: "姓名和電話為必填欄位",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "報名成功！",
      description: "我們將盡快與您聯繫確認報名資訊",
    });
    setIsEnrollDialogOpen(false);
    setEnrollForm({ name: "", phone: "", email: "", note: "" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "已複製連結",
      description: "課程連結已複製到剪貼簿",
    });
  };

  const spotsLeft = mockCourse.maxStudents - mockCourse.currentStudents;

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Back Button */}
        <Link to="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>返回課程列表</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <SportBadge sport={mockCourse.sport} size="md" />
                <SkillLevelBadge level={mockCourse.level} size="md" />
                {mockCourse.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{mockCourse.name}</h1>
              <p className="text-muted-foreground">{mockCourse.description}</p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Calendar className="h-5 w-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">開課日期</div>
                  <div className="font-semibold text-foreground">{mockCourse.startDate}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Clock className="h-5 w-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">每堂時長</div>
                  <div className="font-semibold text-foreground">{mockCourse.duration}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <BookOpen className="h-5 w-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">課程堂數</div>
                  <div className="font-semibold text-foreground">{mockCourse.totalSessions} 堂</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Users className="h-5 w-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">招生人數</div>
                  <div className="font-semibold text-foreground">{mockCourse.maxStudents} 人</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="curriculum">課程大綱</TabsTrigger>
                <TabsTrigger value="coach">教練介紹</TabsTrigger>
                <TabsTrigger value="reviews">學員評價</TabsTrigger>
              </TabsList>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle>課程大綱</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCourse.curriculum.map((item) => (
                        <div key={item.week} className="flex gap-4 p-4 rounded-lg bg-secondary">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-primary">{item.week}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Coach Tab */}
              <TabsContent value="coach">
                <Card>
                  <CardHeader>
                    <CardTitle>教練介紹</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-primary">{mockCourse.coachAvatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-foreground">{mockCourse.coach}</h3>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-semibold">{mockCourse.coachRating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{mockCourse.coachBio}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>已教授 {mockCourse.coachStudents} 位學員</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>學員評價</CardTitle>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-5 w-5 fill-current" />
                        <span className="text-lg font-bold">{mockCourse.coachRating}</span>
                        <span className="text-muted-foreground text-sm">({mockCourse.reviews.length} 則評價)</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCourse.reviews.map((review) => (
                        <div key={review.id} className="p-4 rounded-lg bg-secondary">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">{review.name[0]}</span>
                              </div>
                              <span className="font-medium text-foreground">{review.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary">${mockCourse.price}</div>
                  <div className="text-muted-foreground">/堂</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    全期 {mockCourse.totalSessions} 堂 = ${mockCourse.price * mockCourse.totalSessions}
                  </div>
                </div>

                {/* Spots Left */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {spotsLeft > 0 ? (
                      <>剩餘 <span className="font-bold text-primary">{spotsLeft}</span> 個名額</>
                    ) : (
                      <span className="text-destructive font-bold">已額滿</span>
                    )}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">報名進度</span>
                    <span className="font-medium">{mockCourse.currentStudents}/{mockCourse.maxStudents}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${(mockCourse.currentStudents / mockCourse.maxStudents) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Enroll Button */}
                <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-3" size="lg" disabled={spotsLeft === 0}>
                      {spotsLeft > 0 ? "立即報名" : "已額滿"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>報名課程</DialogTitle>
                      <DialogDescription>
                        請填寫您的聯絡資訊，我們將盡快與您確認報名
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="p-4 rounded-lg bg-secondary mb-4">
                        <div className="font-semibold text-foreground">{mockCourse.name}</div>
                        <div className="text-sm text-muted-foreground">{mockCourse.schedule}</div>
                        <div className="text-sm font-medium text-primary mt-1">
                          全期費用：${mockCourse.price * mockCourse.totalSessions}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">姓名 *</Label>
                        <Input
                          id="name"
                          value={enrollForm.name}
                          onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                          placeholder="請輸入您的姓名"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">電話 *</Label>
                        <Input
                          id="phone"
                          value={enrollForm.phone}
                          onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                          placeholder="請輸入您的電話"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={enrollForm.email}
                          onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                          placeholder="請輸入您的 Email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="note">備註</Label>
                        <Textarea
                          id="note"
                          value={enrollForm.note}
                          onChange={(e) => setEnrollForm({ ...enrollForm, note: e.target.value })}
                          placeholder="如有特殊需求請在此說明"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={handleEnroll}>
                        確認報名
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    {isFavorite ? "已收藏" : "收藏"}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    分享
                  </Button>
                </div>

                {/* Course Details */}
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">{mockCourse.schedule}</div>
                      <div className="text-sm text-muted-foreground">
                        {mockCourse.startDate} ~ {mockCourse.endDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">{mockCourse.location}</div>
                      <div className="text-sm text-muted-foreground">{mockCourse.address}</div>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-foreground mb-3">課程特色</h4>
                  <div className="space-y-2">
                    {mockCourse.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
