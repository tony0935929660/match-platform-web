import { User } from "@/contexts/AuthContext";

const LINE_TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const LINE_PROFILE_URL = "https://api.line.me/v2/profile";

export interface LineTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface BackendUser {
  id: number;
  lineId: string;
  lineName: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  pictureUrl?: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: BackendUser;
    merchant?: unknown;
  };
}

/**
 * 使用授權碼交換 Access Token
 */
export async function exchangeCodeForToken(code: string): Promise<LineTokenResponse> {
  const clientId = import.meta.env.VITE_LINE_CHANNEL_ID;
  const clientSecret = import.meta.env.VITE_LINE_CHANNEL_SECRET;
  const redirectUri = import.meta.env.VITE_LINE_REDIRECT_URI || `${window.location.origin}/auth/line/callback`;

  console.log("=== Token Exchange Debug ===");
  console.log("Client ID:", clientId);
  console.log("Client Secret:", clientSecret ? `${clientSecret.substring(0, 8)}...` : "MISSING!");
  console.log("Redirect URI:", redirectUri);
  console.log("Code:", code ? `${code.substring(0, 10)}...` : "MISSING!");

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  console.log("Request params:", params.toString());

  const response = await fetch(LINE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("LINE Token Exchange Error:", error);
    throw new Error(error.error_description || "Failed to exchange code for token");
  }

  return response.json();
}

/**
 * 獲取用戶的 LINE Profile
 */
export async function getLineProfile(accessToken: string): Promise<LineProfile> {
  const response = await fetch(LINE_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch LINE profile");
  }

  return response.json();
}

/**
 * 呼叫後端 API 進行登入驗證
 */
export async function loginWithBackend(accessToken: string): Promise<BackendAuthResponse> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  console.log("Calling backend API with access token:", accessToken.substring(0, 20) + "...");
  
  const response = await fetch(`${apiBaseUrl}/api/auth/line-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend API error:", response.status, errorText);
    
    let errorMessage = "後端登入驗證失敗";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.title || errorMessage;
    } catch {
      // 如果不是 JSON，使用原始文字
      if (errorText) {
        errorMessage = errorText;
      }
    }
    
    throw new Error(`${errorMessage} (${response.status})`);
  }

  const data = await response.json();
  console.log("Backend API response:", JSON.stringify(data, null, 2));
  return data;
}

/**
 * 從後端回應建立應用程式用戶
 */
export function createUserFromBackendResponse(response: BackendAuthResponse): User {
  const userData = response.data.user;
  
  console.log("Creating user from response:", userData);
  
  return {
    id: userData.lineId || String(userData.id),
    displayName: userData.name || userData.lineName,
    pictureUrl: userData.pictureUrl || undefined,
    email: userData.email || undefined,
  };
}

/**
 * 使用授權碼登入（讓後端處理 token 交換）
 */
export async function loginWithCode(code: string): Promise<BackendAuthResponse> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const redirectUri = import.meta.env.VITE_LINE_REDIRECT_URI || `${window.location.origin}/auth/line/callback`;
  
  console.log("=== LINE Login Debug ===");
  console.log("API Base URL:", apiBaseUrl);
  console.log("Redirect URI:", redirectUri);
  console.log("Authorization Code:", code ? `${code.substring(0, 10)}...` : "MISSING!");
  
  const response = await fetch(`${apiBaseUrl}/api/auth/line-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      code,
      redirectUri 
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend API error:", response.status, errorText);
    
    let errorMessage = "LINE 登入失敗";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      if (errorText) {
        errorMessage = errorText;
      }
    }
    
    throw new Error(`${errorMessage} (${response.status})`);
  }

  const data = await response.json();
  console.log("LINE Login successful:", data.data?.user?.lineName || "User");
  return data;
}

/**
 * 完整的 LINE 登入流程（安全版本 - 所有敏感操作都在後端）
 */
export async function processLineCallback(code: string): Promise<{ user: User; token: string }> {
  console.log("Processing LINE callback...");
  
  // 直接將 code 傳給後端處理，後端會：
  // 1. 使用 Channel Secret 與 LINE 交換 access_token
  // 2. 獲取用戶的 LINE Profile
  // 3. 建立或更新用戶記錄
  // 4. 產生並回傳 JWT token
  const backendResponse = await loginWithCode(code);
  
  if (!backendResponse.success) {
    throw new Error(backendResponse.message || "登入失敗");
  }
  
  // 建立應用程式用戶
  const user = createUserFromBackendResponse(backendResponse);
  
  return {
    user,
    token: backendResponse.data.token,
  };
}
