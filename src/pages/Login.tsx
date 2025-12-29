import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LineLoginButton } from "@/components/auth/LineLoginButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();

  // 如果已經登入，導向首頁
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-2xl">🏸</span>
            </div>
          </Link>
          <CardTitle className="text-2xl">歡迎來到揪團GO</CardTitle>
          <CardDescription>
            登入後即可開始揪團、參加活動
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <LineLoginButton className="w-full" size="lg" />
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                安全登入
              </span>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            使用 LINE 帳號登入，我們不會取得您的密碼
          </p>
          
          <p className="text-center text-xs text-muted-foreground">
            登入即表示您同意我們的
            <Link to="/terms" className="text-primary hover:underline mx-1">
              服務條款
            </Link>
            和
            <Link to="/privacy" className="text-primary hover:underline mx-1">
              隱私權政策
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
