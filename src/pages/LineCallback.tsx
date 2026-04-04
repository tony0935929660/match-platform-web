import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { processLineCallback } from "@/services/lineAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type CallbackStatus = "loading" | "success" | "error";

export default function LineCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // 檢查是否有錯誤
      if (error) {
        setStatus("error");
        setErrorMessage(errorDescription || "LINE 登入失敗");
        return;
      }

      // 檢查授權碼
      if (!code) {
        setStatus("error");
        setErrorMessage("未收到授權碼");
        return;
      }

      // 驗證 state（CSRF 保護）
      const savedState = localStorage.getItem("line_auth_state");
      if (state !== savedState) {
        setStatus("error");
        setErrorMessage("安全驗證失敗，請重新登入");
        return;
      }

      try {
        // 處理 LINE 回調並呼叫後端 API
        const { user, token, phone } = await processLineCallback(code);
        setUser(user);
        setToken(token);
        setStatus("success");
        
        // 清除 state
        localStorage.removeItem("line_auth_state");
        const redirectUrl = localStorage.getItem("login_redirect_url");
        localStorage.removeItem("login_redirect_url");
        
        // 延遲導向，讓用戶看到成功訊息
        setTimeout(() => {
          // 若尚未填寫電話，強制導向個人資料頁面補填
          if (!phone) {
            navigate("/profile", { replace: true });
          } else {
            navigate(redirectUrl || "/", { replace: true });
          }
        }, 1500);
      } catch (err) {
        console.error("LINE callback error:", err);
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "登入處理失敗");
      }
    };

    handleCallback();
  }, [searchParams, setUser, setToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-2xl">🏸</span>
            </div>
          </div>
          <CardTitle className="text-xl">
            {status === "loading" && "正在處理登入..."}
            {status === "success" && "登入成功！"}
            {status === "error" && "登入失敗"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "請稍候，正在驗證您的 LINE 帳號"}
            {status === "success" && "即將為您導向首頁"}
            {status === "error" && errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          )}
          {status === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive" />
              <Button
                onClick={() => navigate("/login", { replace: true })}
                className="mt-4"
              >
                返回登入頁面
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
