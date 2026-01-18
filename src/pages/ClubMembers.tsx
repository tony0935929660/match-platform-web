import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Filter,
  Loader2
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getGroup, getGroupMembers, GroupMemberResponse } from "@/services/groupApi";

export default function ClubMembers() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId") || "";
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // 獲取球團詳情
  const { data: club } = useQuery({
    queryKey: ['groupDetail', groupId],
    queryFn: () => getGroup(Number(groupId), token!),
    enabled: !!token && !!groupId,
  });

  // 獲取成員列表
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: () => getGroupMembers(token!, Number(groupId)),
    enabled: !!token && !!groupId,
  });
  
  const filteredMembers = members.filter((member: GroupMemberResponse) => 
    member.userName?.includes(searchQuery) || member.lineName?.includes(searchQuery)
  );

  // 格式化加入日期
  const formatJoinDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <MainLayout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/club?groupId=${groupId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">成員管理</h1>
            <p className="text-muted-foreground mt-1">管理{club?.name || "球團"}所有成員</p>
          </div>
          <ClubInviteDialog 
            clubId={groupId} 
            clubName={club?.name || "球團"}
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
              <div className="text-2xl font-bold text-foreground">{members.length}</div>
              <div className="text-sm text-muted-foreground">總成員</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {members.filter((m: GroupMemberResponse) => m.role === 2).length}
              </div>
              <div className="text-sm text-muted-foreground">管理員</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {members.filter((m: GroupMemberResponse) => m.role === 1).length}
              </div>
              <div className="text-sm text-muted-foreground">一般成員</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">-</div>
              <div className="text-sm text-muted-foreground">待確認</div>
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
            {isLoadingMembers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "找不到符合的成員" : "目前沒有成員"}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMembers.map((member: GroupMemberResponse) => (
                  <div key={member.userId} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary">{member.userName?.[0] || "?"}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{member.userName || member.lineName || "未知用戶"}</span>
                          <Badge variant={member.role === 2 ? "default" : "secondary"}>
                            {member.role === 2 ? "管理員" : "成員"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {member.phone || member.email || "未提供聯絡資訊"}
                          </span>
                          {member.joinedAt && (
                            <span className="text-xs text-muted-foreground">• 加入於 {formatJoinDate(member.joinedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>查看資料</DropdownMenuItem>
                          <DropdownMenuItem>調整權限</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">移除成員</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
