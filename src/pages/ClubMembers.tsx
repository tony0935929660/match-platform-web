import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillLevelBadge } from "@/components/ui/SkillLevelBadge";
import { CreditBadge } from "@/components/ui/CreditBadge";
import { ClubInviteDialog } from "@/components/ClubInviteDialog";
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

const mockClub = {
  id: "1",
  name: "羽翔俱樂部",
};

const mockMembers = [
  { id: "1", name: "王小明", level: 5, creditScore: 4.8, role: "admin", status: "active", paymentStatus: "paid", joinDate: "2023/03" },
  { id: "2", name: "李大華", level: 4, creditScore: 4.5, role: "member", status: "active", paymentStatus: "paid", joinDate: "2023/05" },
  { id: "3", name: "陳美玲", level: 4, creditScore: 4.2, role: "member", status: "active", paymentStatus: "pending", joinDate: "2023/06" },
  { id: "4", name: "黃志強", level: 3, creditScore: 4.6, role: "member", status: "active", paymentStatus: "paid", joinDate: "2023/08" },
  { id: "5", name: "林小芳", level: 5, creditScore: 4.9, role: "member", status: "active", paymentStatus: "paid", joinDate: "2023/09" },
  { id: "6", name: "張明德", level: 3, creditScore: 3.8, role: "casual", status: "active", paymentStatus: "unpaid", joinDate: "2024/01" },
  { id: "7", name: "周美麗", level: 4, creditScore: 4.3, role: "member", status: "active", paymentStatus: "paid", joinDate: "2024/02" },
  { id: "8", name: "吳建國", level: 5, creditScore: 4.7, role: "member", status: "active", paymentStatus: "paid", joinDate: "2024/03" },
];

export default function ClubMembers() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredMembers = mockMembers.filter(member => 
    member.name.includes(searchQuery)
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">成員管理</h1>
            <p className="text-muted-foreground mt-1">管理球團所有成員</p>
          </div>
          <ClubInviteDialog 
            clubId={mockClub.id} 
            clubName={mockClub.name}
            trigger={
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                邀請成員
              </Button>
            }
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{mockMembers.length}</div>
              <div className="text-sm text-muted-foreground">總成員</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {mockMembers.filter(m => m.role === "admin").length}
              </div>
              <div className="text-sm text-muted-foreground">管理員</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {mockMembers.filter(m => m.paymentStatus === "paid").length}
              </div>
              <div className="text-sm text-muted-foreground">已繳費</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">
                {mockMembers.filter(m => m.paymentStatus !== "paid").length}
              </div>
              <div className="text-sm text-muted-foreground">待繳費</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋成員..."
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

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>所有成員 ({filteredMembers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-medium text-primary">{member.name[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{member.name}</span>
                        <Badge variant={member.role === "admin" ? "default" : member.role === "casual" ? "outline" : "secondary"}>
                          {member.role === "admin" ? "管理員" : member.role === "casual" ? "臨打" : "成員"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <SkillLevelBadge level={member.level} size="sm" />
                        <CreditBadge score={member.creditScore} confidence="high" size="sm" />
                        <span className="text-xs text-muted-foreground">加入於 {member.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.paymentStatus === "paid" ? "default" : member.paymentStatus === "pending" ? "secondary" : "destructive"}>
                      {member.paymentStatus === "paid" ? "已繳費" : member.paymentStatus === "pending" ? "待確認" : "未繳費"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>查看資料</DropdownMenuItem>
                        <DropdownMenuItem>調整權限</DropdownMenuItem>
                        <DropdownMenuItem>調整費率</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">移除成員</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
