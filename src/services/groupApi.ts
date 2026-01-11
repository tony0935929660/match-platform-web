const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 建立球團請求
export interface CreateGroupRequest {
  name: string;           // 球團名稱
  sport: number;          // 運動類型 (enum value)
  description?: string;   // 球團簡介
  court?: string;         // 活動地點
  address?: string;       // 活動地址
  phone?: string;         // 聯絡電話
  email?: string;         // 電子郵件
  websiteUrl?: string;    // 網站連結
}

// 球團回應
export interface GroupResponse {
  id: number;
  name: string;
  sport: number;
  description?: string;
  court?: string;
  address?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  memberCount: number;
  myRole: number;
  createdAt: string;
  updatedAt?: string;
}

export enum ClubRole {
  Member = 1,
  Admin = 2,
}

// 後端標準回應格式
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 建立新球團
 */
export async function createGroup(token: string, data: CreateGroupRequest): Promise<GroupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/groups`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Create group error:", response.status, errorText);
    
    let errorMessage = "建立球團失敗";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.title || errorMessage;
    } catch {
      if (errorText) {
        errorMessage = errorText;
      }
    }
    
    throw new Error(`${errorMessage} (${response.status})`);
  }

  const result = await response.json();
  console.log("Create group response:", result);
  
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as GroupResponse;
  }
  return result as GroupResponse;
}

/**
 * 取得球團列表
 */
export async function getGroups(token: string): Promise<GroupResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/groups`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`取得球團列表失敗 (${response.status})`);
  }

  const result = await response.json();
  console.log("Get groups response:", result);
  
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as GroupResponse[];
  }
  return result as GroupResponse[];
}

/**
 * 取得單一球團詳情
 */
export async function getGroup(id: number, token: string): Promise<GroupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`取得球團詳情失敗 (${response.status})`);
  }

  const result = await response.json();
  console.log("Get group response:", result);
  
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as GroupResponse;
  }
  return result as GroupResponse;
}
