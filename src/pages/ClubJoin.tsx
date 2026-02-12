import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { joinGroupByLink } from "@/services/groupApi";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function ClubJoin() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated, login } = useAuth();
  const { toast } = useToast();

  const joinMutation = useMutation({
    mutationFn: () => joinGroupByLink(token!, code!),
    onSuccess: () => {
      toast({
        title: "加入成功",
        description: "您已成功加入球團！",
      });
      navigate("/club");
    },
    onError: (error) => {
        // If user is already a member or other error, handle it gracefully
      toast({
        title: "加入失敗",
        description: error.message,
        variant: "destructive",
      });
      // Maybe navigate to club page anyway if they are already partial member?
      // Or stay here to let them retry?
    }
  });

  useEffect(() => {
    if (code && isAuthenticated && !joinMutation.isPending && !joinMutation.isSuccess && !joinMutation.isError) {
      joinMutation.mutate();
    }
  }, [code, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">請先登入</h1>
          <p className="text-muted-foreground">您需要登入才能加入球團</p>
          <Button onClick={() => login(window.location.pathname)}>前往登入</Button>
          
          {/* Debug info - only show in dev or if explicitly enabled */}
             <div className="mt-8 p-4 bg-muted rounded text-xs text-muted-foreground break-all max-w-full">
                <p>Debug Info:</p>
                <p>Path: {window.location.pathname}</p>
                <p>Code: {code}</p>
                <p>Auth: {isAuthenticated ? "Yes" : "No"}</p>
             </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-4">
        {joinMutation.isPending && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">正在加入球團...</p>
          </>
        )}
        {joinMutation.isError && (
          <>
            <h1 className="text-2xl font-bold text-destructive">加入失敗</h1>
            <p className="text-muted-foreground">{joinMutation.error.message}</p>
             <div className="mt-4 p-4 bg-muted rounded text-xs text-muted-foreground break-all max-w-full">
                <p>Debug Info:</p>
                <p>Path: {window.location.pathname}</p>
                <p>Code: {code}</p>
                <p>Error Name: {joinMutation.error?.name}</p>
                <p>Error Message: {joinMutation.error?.message}</p>
                <p>Full Error: {String(joinMutation.error)}</p>
             </div>
            <Link to="/">
              <Button variant="outline">回首頁</Button>
            </Link>
          </>
        )}
      </div>
    </MainLayout>
  );
}
