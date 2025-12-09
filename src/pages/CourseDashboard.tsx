import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SportBadge, SportType } from "@/components/ui/SportBadge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { 
  Plus,
  Settings,
  Users,
  DollarSign,
  Calendar,
  BookOpen,
  Clock,
  MoreVertical,
  UserPlus,
  ChevronRight,
  MapPin,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const mockCourse = {
  id: "1",
  name: "羽球基礎班",
  sport: "badminton" as SportType,
  coach: "林教練",
  students: 12,
  createdAt: "2024/01",
  description: "適合初學者的羽球課程，從基本動作到實戰技巧。",
  level: 2,
  price: 800,
  duration: "2小時",
};

const mockUpcomingClasses = [
  {
    id: "1",
    title: "第 8 堂：殺球技巧",
    date: "12/11 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    currentStudents: 10,
    maxStudents: 12,
    status: "upcoming" as const,
  },
  {
    id: "2",
    title: "第 9 堂：網前技術",
    date: "12/18 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    currentStudents: 11,
    maxStudents: 12,
    status: "upcoming" as const,
  },
  {
    id: "3",
    title: "第 10 堂：雙打配合",
    date: "12/25 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    currentStudents: 10,
    maxStudents: 12,
    status: "upcoming" as const,
  },
];

const mockStudents = [
  { id: "1", name: "王小明", level: 2, progress: 80, status: "active", paymentStatus: "paid", attendance: 7 },
  { id: "2", name: "李大華", level: 1, progress: 65, status: "active", paymentStatus: "paid", attendance: 6 },
  { id: "3", name: "陳美玲", level: 2, progress: 90, status: "active", paymentStatus: "pending", attendance: 8 },
  { id: "4", name: "黃志強", level: 1, progress: 55, status: "active", paymentStatus: "paid", attendance: 5 },
];

const mockPayments = [
  { id: "1", userName: "陳美玲", amount: 9600, date: "2024/12/09", status: "pending", sessions: 12 },
  { id: "2", userName: "張明德", amount: 9600, date: "2024/12/08", status: "unpaid", sessions: 12 },
  { id: "3", userName: "李大華", amount: 9600, date: "2024/11/01", status: "paid", sessions: 12 },
];

export default function CourseDashboard() {
  const [activeTab, setActiveTab] = useState("students");
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToTabsAndSwitch = (tab: string) => {
    setActiveTab(tab);
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Course Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{mockCourse.name}</h1>
                <SportBadge sport={mockCourse.sport} size="sm" />
                <SkillLevelBadge level={mockCourse.level} size="sm" />
              </div>
              <p className="text-muted-foreground">{mockCourse.coach} · {mockCourse.students} 學員 · ${mockCourse.price}/堂</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/course/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                新增課程
              </Button>
            </Link>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/course/classes">
            <Card className="cursor-pointer hover:shadow-card-hover transition-all h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="font-semibold text-foreground">課堂管理</div>
                <div className="text-sm text-muted-foreground">{mockUpcomingClasses.length} 堂即將開課</div>
              </CardContent>
            </Card>
          </Link>
          
          <Card 
            className="cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => scrollToTabsAndSwitch("students")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-semibold text-foreground">學員管理</div>
              <div className="text-sm text-muted-foreground">{mockCourse.students} 位學員</div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => scrollToTabsAndSwitch("payments")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-semibold text-foreground">收費管理</div>
              <div className="text-sm text-muted-foreground">2 筆待確認</div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => scrollToTabsAndSwitch("progress")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-semibold text-foreground">學習進度</div>
              <div className="text-sm text-muted-foreground">平均進度 72%</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Classes Preview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>即將開課</CardTitle>
              <Link to="/course/classes">
                <Button variant="outline" size="sm" className="gap-2">
                  查看全部
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUpcomingClasses.slice(0, 3).map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{classItem.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {classItem.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {classItem.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {classItem.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {classItem.currentStudents}/{classItem.maxStudents}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {classItem.maxStudents - classItem.currentStudents > 0 
                          ? `剩餘 ${classItem.maxStudents - classItem.currentStudents} 位`
                          : "已額滿"
                        }
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>編輯課堂</DropdownMenuItem>
                        <DropdownMenuItem>點名管理</DropdownMenuItem>
                        <DropdownMenuItem>課堂筆記</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">取消課堂</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div ref={tabsRef}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="students" className="gap-2">
                <Users className="h-4 w-4" />
                學員
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <DollarSign className="h-4 w-4" />
                收費
              </TabsTrigger>
              <TabsTrigger value="progress" className="gap-2">
                <BookOpen className="h-4 w-4" />
                進度
              </TabsTrigger>
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>學員管理</CardTitle>
                    <div className="flex gap-2">
                      <Link to="/course/students">
                        <Button variant="outline" size="sm" className="gap-2">
                          查看全部
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button size="sm" className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        新增學員
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">{student.name[0]}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{student.name}</span>
                              <SkillLevelBadge level={student.level} size="sm" />
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span>出席 {student.attendance}/8 堂</span>
                              <span>·</span>
                              <span>進度 {student.progress}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={student.paymentStatus === "paid" ? "default" : student.paymentStatus === "pending" ? "secondary" : "destructive"}>
                            {student.paymentStatus === "paid" ? "已繳費" : student.paymentStatus === "pending" ? "待確認" : "未繳費"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>查看資料</DropdownMenuItem>
                              <DropdownMenuItem>學習紀錄</DropdownMenuItem>
                              <DropdownMenuItem>調整進度</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">移除學員</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-foreground">$115,200</div>
                    <div className="text-sm text-muted-foreground">本期總收入</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-foreground">10</div>
                    <div className="text-sm text-muted-foreground">已繳費學員</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-warning">2</div>
                    <div className="text-sm text-muted-foreground">待繳費學員</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>收費紀錄</CardTitle>
                    <Link to="/course/payments">
                      <Button variant="outline" size="sm" className="gap-2">
                        查看全部
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">{payment.userName[0]}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">{payment.userName}</span>
                            <div className="text-sm text-muted-foreground">
                              {payment.sessions} 堂課程 · {payment.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-semibold text-foreground">${payment.amount.toLocaleString()}</div>
                          </div>
                          <Badge variant={payment.status === "paid" ? "default" : payment.status === "pending" ? "secondary" : "destructive"}>
                            {payment.status === "paid" ? "已付款" : payment.status === "pending" ? "待確認" : "未付款"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>學員學習進度</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStudents.map((student) => (
                      <div key={student.id} className="p-4 rounded-lg bg-secondary">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">{student.name[0]}</span>
                            </div>
                            <span className="font-medium text-foreground">{student.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">{student.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>出席率：{Math.round((student.attendance / 8) * 100)}%</span>
                          <span>{student.attendance}/8 堂課</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
