import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  MoreVertical,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

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

const mockPastClasses = [
  {
    id: "4",
    title: "第 7 堂：挑球練習",
    date: "12/04 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    currentStudents: 11,
    maxStudents: 12,
    attendance: 10,
    status: "completed" as const,
  },
  {
    id: "5",
    title: "第 6 堂：正手技術",
    date: "11/27 (三)",
    time: "19:00-21:00",
    location: "台北市大安運動中心",
    currentStudents: 12,
    maxStudents: 12,
    attendance: 11,
    status: "completed" as const,
  },
];

export default function CourseClasses() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUpcoming = mockUpcomingClasses.filter(classItem => 
    classItem.title.includes(searchQuery) || classItem.location.includes(searchQuery)
  );

  const filteredPast = mockPastClasses.filter(classItem => 
    classItem.title.includes(searchQuery) || classItem.location.includes(searchQuery)
  );

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/course">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">課堂管理</h1>
            <p className="text-muted-foreground mt-1">管理所有課堂內容</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            新增課堂
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{mockUpcomingClasses.length}</div>
              <div className="text-sm text-muted-foreground">即將開課</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{mockPastClasses.length}</div>
              <div className="text-sm text-muted-foreground">已完成</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {mockUpcomingClasses.reduce((sum, c) => sum + c.currentStudents, 0)}
              </div>
              <div className="text-sm text-muted-foreground">總報名人數</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">92%</div>
              <div className="text-sm text-muted-foreground">平均出席率</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋課堂..."
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

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">即將開課 ({mockUpcomingClasses.length})</TabsTrigger>
            <TabsTrigger value="past">歷史課堂 ({mockPastClasses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredUpcoming.map((classItem) => (
              <ClassItem key={classItem.id} classItem={classItem} />
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {filteredPast.map((classItem) => (
              <ClassItem key={classItem.id} classItem={classItem} isPast />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

interface ClassItemProps {
  classItem: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    currentStudents: number;
    maxStudents: number;
    attendance?: number;
    status: "upcoming" | "completed";
  };
  isPast?: boolean;
}

function ClassItem({ classItem, isPast = false }: ClassItemProps) {
  return (
    <div className="p-4 md:p-6 rounded-xl border bg-card shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isPast && (
              <Badge variant="secondary">已結束</Badge>
            )}
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-2">{classItem.title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {classItem.date}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {classItem.time}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {classItem.location}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {isPast && classItem.attendance ? `${classItem.attendance}/` : ""}{classItem.currentStudents}/{classItem.maxStudents}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {isPast 
                ? `出席率 ${Math.round((classItem.attendance! / classItem.currentStudents) * 100)}%`
                : classItem.maxStudents - classItem.currentStudents > 0 
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
              {!isPast && <DropdownMenuItem className="text-destructive">取消課堂</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
