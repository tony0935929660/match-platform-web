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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft,
  UserPlus,
  Search,
  MoreVertical,
  Filter,
  Loader2
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getGroup, getGroupMembers, removeMember, updateMemberRole, GroupMemberResponse } from "@/services/groupApi";
import { getGroupRoles, GroupRoleEnum } from "@/services/enumApi";
import { useToast } from "@/hooks/use-toast";

export default function ClubMembers() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId") || "";
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [memberToDelete, setMemberToDelete] = useState<GroupMemberResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 獲取球團角色列表
  const { data: roles = [] } = useQuery({
    queryKey: ['groupRoles'],
    queryFn: getGroupRoles,
  });

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

  // 移除成員 Mutation
  const removeMemberMutation = useMutation({
    mutationFn: (userId: number) => removeMember(token!, Number(groupId), userId),
    onSuccess: () => {
      toast({
        title: "移除成功",
        description: "該成員已從球團中移除",
      });
      queryClient.invalidateQueries({ queryKey: ['groupMembers', groupId] });
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "移除失敗",
        description: error.message,
      });
    }
  });

  // 更新角色 Mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: number }) => 
      updateMemberRole(token!, Number(groupId), userId, role),
    onSuccess: () => {
      toast({
        title: "更新成功",
        description: "成員權限已更新",
      });
      queryClient.invalidateQueries({ queryKey: ['groupMembers', groupId] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "更新失敗",
        description: error.message,
      });
    }
  });

  const handleRemoveClick = (member: GroupMemberResponse) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmRemove = () => {
    if (memberToDelete) {
      removeMemberMutation.mutate(memberToDelete.userId);
    }
  };

  const handleRoleChange = (userId: number, newRole: number) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };
  
  const filteredMembers = members.filter((member: GroupMemberResponse) => 
    member.userName?.includes(searchQuery) || member.lineName?.includes(searchQuery)
  );

  const getRoleName = (roleValue: number) => {
    const role = roles.find((r: GroupRoleEnum) => r.value === roleValue);
    return role ? role.displayName : "一般成員";
  };

  // 檢查當前用戶是否為管理員
  const currentUserMembership = members.find((m: GroupMemberResponse) => m.userId === Number(user?.id)); // Assuming user.id corresponds to userId
  // 這裡假設後端有正確回傳 myRole 在 group detail 或者我們可以從 members 中找到自己
  // API GroupResponse 有 myRole，這裡也可以用 club.myRole
  const isClubAdmin = club?.myRole === 2;

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
          
          {roles.map((role: GroupRoleEnum) => (
            <Card key={role.value}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">
                  {members.filter((m: GroupMemberResponse) => m.role === role.value).length}
                </div>
                <div className="text-sm text-muted-foreground">{role.displayName}</div>
              </CardContent>
            </Card>
          ))}
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
                          <Badge variant={member.role >= 2 ? "default" : "secondary"}>
                            {getRoleName(member.role)}
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
                      {isClubAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>查看資料</DropdownMenuItem>
                            {roles
                              .filter((r: GroupRoleEnum) => r.value !== member.role)
                              .map((r: GroupRoleEnum) => (
                              <DropdownMenuItem key={r.value} onClick={() => handleRoleChange(member.userId, r.value)}>
                                設為{r.displayName}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleRemoveClick(member)}
                            >
                              移除成員
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>確定要移除成員嗎？</AlertDialogTitle>
              <AlertDialogDescription>
                移除後，{memberToDelete?.userName || memberToDelete?.lineName} 將無法再存取球團資訊。
                此動作無法復原。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmRemove}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                移除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
