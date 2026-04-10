import { getLiffIdToken } from "@/lib/liff";
import { User } from "@/contexts/AuthContext";
import { BackendAuthResponse, createUserFromBackendResponse } from "@/services/lineAuth";

/**
 * 透過 LIFF ID Token 向後端進行登入驗證
 * 後端需實作 POST /api/auth/liff-login，接收 { idToken } 並回傳 BackendAuthResponse
 */
export async function loginWithLiff(): Promise<{ user: User; token: string; phone: string | null }> {
  const idToken = getLiffIdToken();
  if (!idToken) {
    throw new Error("無法取得 LIFF ID Token，請確認 LIFF 已初始化且使用者已登入");
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(`${apiBaseUrl}/api/auth/liff-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "LIFF 登入驗證失敗";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.title || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  const data: BackendAuthResponse = await response.json();

  if (!data.success) {
    throw new Error(data.message || "LIFF 登入失敗");
  }

  const user = createUserFromBackendResponse(data);

  return {
    user,
    token: data.data.token,
    phone: data.data.user.phone ?? null,
  };
}
