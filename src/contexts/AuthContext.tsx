import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  displayName: string;
  pictureUrl?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "court_connect_auth";
const TOKEN_STORAGE_KEY = "court_connect_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 從 localStorage 載入用戶資料和 Token
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    
    if (storedAuth) {
      try {
        const userData = JSON.parse(storedAuth);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    setIsLoading(false);
  }, []);

  // 當用戶資料變更時，同步到 localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // 當 Token 變更時，同步到 localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  const login = () => {
    // 導向 LINE 登入
    const clientId = import.meta.env.VITE_LINE_CHANNEL_ID;
    const redirectUri = import.meta.env.VITE_LINE_REDIRECT_URI || `${window.location.origin}/auth/line/callback`;
    const state = generateRandomState();
    
    // 儲存 state 用於驗證回調
    sessionStorage.setItem("line_auth_state", state);
    
    const lineAuthUrl = new URL("https://access.line.me/oauth2/v2.1/authorize");
    lineAuthUrl.searchParams.set("response_type", "code");
    lineAuthUrl.searchParams.set("client_id", clientId);
    lineAuthUrl.searchParams.set("redirect_uri", redirectUri);
    lineAuthUrl.searchParams.set("state", state);
    lineAuthUrl.searchParams.set("scope", "profile openid email");
    
    window.location.href = lineAuthUrl.toString();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// 生成隨機 state 用於 CSRF 保護
function generateRandomState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
