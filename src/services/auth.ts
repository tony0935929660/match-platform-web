const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  lineId?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

/**
 * LINE 第三方登入
 * @param accessToken LINE 登入後取得的 access token
 */
export async function lineLogin(accessToken: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/line-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    const error: AuthError = await response.json().catch(() => ({ 
      message: '登入失敗，請稍後再試' 
    }));
    throw new Error(error.message || '登入失敗');
  }

  return response.json();
}

/**
 * 登出
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
  }
  
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

/**
 * 取得目前登入的使用者
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * 儲存登入資訊
 */
export function saveAuthData(data: LoginResponse): void {
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

/**
 * 取得 auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * 檢查是否已登入
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
