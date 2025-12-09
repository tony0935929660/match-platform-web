import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft,
  UserPlus,
  Search,
  MoreVertical,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

const mockStudents = [
  { id: "1", name: "王小明", level: 2, progress: 80, status: "active", paymentStatus: "paid", attendance: 7, totalClasses: 8, phone: "0912-345-678", joinDate: "2024/09" },
  { id: "2", name: "李大華", level: 1, progress: 65, status: "active", paymentStatus: "paid", attendance: 6, totalClasses: 8, phone: "0923-456-789", joinDate: "2024/09" },
  { id: "3", name: "陳美玲", level: 2, progress: 90, status: "active", paymentStatus: "pending", attendance: 8, totalClasses: 8, phone: "0934-567-890", joinDate: "2024/09" },
  { id: "4", name: "黃志強", level: 1, progress: 55, status: "active", paymentStatus: "paid", attendance: 5, totalClasses: 8, phone: "0945-678-901", joinDate: "2024/10" },
  { id: "5", name: "林小芳", level: 2, progress: 75, status: "active", paymentStatus: "paid", attendance: 6, totalClasses: 8, phone: "0956-789-012", joinDate: "2024/10" },
  { id: "6", name: "張明德", level: 1, progress: 40, status: "active", paymentStatus: "unpaid", attendance: 4, totalClasses: 8, phone: "0967-890-123", joinDate: "2024/11" },
  { id: "7", name: "周美麗", level: 2, progress: 85, status: "active", paymentStatus: "paid", attendance: 7, totalClasses: 8, phone: "0978-901-234", joinDate: "2024/11" },
  { id: "8", name: "吳建國", level: 3, progress: 95, status: "active", paymentStatus: "paid", attendance: 8, totalClasses: 8, phone: "0989-012-345", joinDate: "2024/11" },
];

export default function CourseStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredStudents = mockStudents.filter(student => 
    student.name.includes(searchQuery) || student.phone.includes(searchQuery)
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">學員管理</h1>
            <p className="text-muted-foreground mt-1">管理課程所有學員</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            新增學員
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{mockStudents.length}</div>
              <div className="text-sm text-muted-foreground">總學員</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {mockStudents.filter(s => s.paymentStatus === "paid").length}
              </div>
              <div className="text-sm text-muted-foreground">已繳費</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {Math.round(mockStudents.reduce((sum, s) => sum + s.progress, 0) / mockStudents.length)}%
              </div>
              <div className="text-sm text-muted-foreground">平均進度</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {Math.round(mockStudents.reduce((sum, s) => sum + (s.attendance / s.totalClasses), 0) / mockStudents.length * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">平均出席率</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋學員姓名或電話..."
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

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>所有學員 ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div key={student.id} className="p-4 rounded-lg bg-secondary">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary">{student.name[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{student.name}</span>
                          <SkillLevelBadge level={student.level} size="sm" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{student.phone}</span>
                          <span>·</span>
                          <span>加入於 {student.joinDate}</span>
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
                          <DropdownMenuItem>發送訊息</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">移除學員</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">學習進度</span>
                        <span className="font-medium text-foreground">{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">出席率</span>
                        <span className="font-medium text-foreground">{Math.round((student.attendance / student.totalClasses) * 100)}%</span>
                      </div>
                      <Progress value={(student.attendance / student.totalClasses) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
