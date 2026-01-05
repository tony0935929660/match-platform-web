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

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const response = await fetch(LINE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
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
 * 完整的 LINE 登入流程
 */
export async function processLineCallback(code: string): Promise<{ user: User; token: string }> {
  // 1. 交換授權碼獲取 Access Token
  console.log("Step 1: Exchanging code for token...");
  const tokenResponse = await exchangeCodeForToken(code);
  console.log("Access token obtained:", tokenResponse.access_token.substring(0, 20) + "...");
  
  // 2. 先在前端驗證 token 是否有效（測試用）
  console.log("Step 2: Verifying token with LINE Profile API...");
  const profile = await getLineProfile(tokenResponse.access_token);
  console.log("LINE Profile verified:", profile);
  
  // 3. 呼叫後端 API 進行登入
  console.log("Step 3: Calling backend API...");
  const backendResponse = await loginWithBackend(tokenResponse.access_token);
  
  if (!backendResponse.success) {
    throw new Error(backendResponse.message || "登入失敗");
  }
  
  // 4. 建立應用程式用戶
  const user = createUserFromBackendResponse(backendResponse);
  
  return {
    user,
    token: backendResponse.data.token,
  };
}
