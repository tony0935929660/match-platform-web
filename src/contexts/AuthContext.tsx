import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

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

// Helper function to check token validity
const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  try {
    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }
    
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    // Safety check for exp
    if (!payload.exp) return true; // No expiration = valid forever? Or invalid? Assume valid for dev tokens.
    
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  } catch (e) {
    console.error("Token validation failed:", e);
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use refs to keep track of current state inside the fetch interceptor
  const userRef = useRef(user);
  const tokenRef = useRef(token);
  
  useEffect(() => {
    userRef.current = user;
    tokenRef.current = token;
  }, [user, token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };
  
  // Make logout stable ref for interceptor
  const logoutRef = useRef(logout);
  useEffect(() => { logoutRef.current = logout; }, [logout]);

  // 從 localStorage 載入用戶資料和 Token
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    
    // Check if token is expired immediately upon load
    if (storedToken && !isTokenValid(storedToken)) {
         logout();
         setIsLoading(false);
         return;
    }

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

  // Global fetch interceptor for 401
  useEffect(() => {
    // Save original fetch
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
        try {
            const response = await originalFetch(...args);
            if (response.status === 401) {
                // Check if we *think* we are logged in (via localStorage)
                // Using localStorage is safer than closure state here
                if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
                    console.warn("API returned 401 - clearing auth");
                    
                    // Clear storage
                    localStorage.removeItem(TOKEN_STORAGE_KEY);
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                    
                    // Update React state via stable setters or reload
                    // To be safe and ensure clean slate:
                    // window.location.reload(); 
                    
                    // Or call logout via ref if we want to avoid reload
                    // But we can't easily access the ref from this closure if it's not in deps
                    // Actually, we can just dispatch an event?
                    // Or just use the setters if they are stable (useState setters are stable)
                    setUser(null);
                    setToken(null);
                }
            }
            return response;
        } catch (e) {
            throw e;
        }
    };

    return () => {
        window.fetch = originalFetch;
    };
  }, []); // Empty dependency array ensures we only monkey-patch once


  // 當用戶資料變更時，同步到 localStorage
  useEffect(() => {
    console.log("User state changed:", user);
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // 當 Token 變更時，同步到 localStorage
  useEffect(() => {
    // console.log("Token state changed:", token ? "Token set" : "No token");
    if (token) {
      if (!isTokenValid(token)) {
          console.warn("Token expired, clearing");
          logout();
          return;
      }
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  const login = (redirectUrl?: string) => {
    // 導向 LINE 登入
    const clientId = import.meta.env.VITE_LINE_CHANNEL_ID;
    const redirectUri = import.meta.env.VITE_LINE_REDIRECT_URI || `${window.location.origin}/auth/line/callback`;
    const state = generateRandomState();
    
    // 儲存 state 用於驗證回調
    localStorage.setItem("line_auth_state", state);
    
    // Check if redirectUrl is a valid string, not an Event object or empty
    if (redirectUrl && typeof redirectUrl === 'string') {
        localStorage.setItem("login_redirect_url", redirectUrl);
    }
    
    const lineAuthUrl = new URL("https://access.line.me/oauth2/v2.1/authorize");
    lineAuthUrl.searchParams.set("response_type", "code");
    lineAuthUrl.searchParams.set("client_id", clientId);
    lineAuthUrl.searchParams.set("redirect_uri", redirectUri);
    lineAuthUrl.searchParams.set("state", state);
    lineAuthUrl.searchParams.set("scope", "profile openid email");
    
    window.location.href = lineAuthUrl.toString();
  };

  // Removed duplicate logout function
  // const logout = () => { ... }

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
