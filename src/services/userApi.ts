const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UserProfile {
  id: number;
  lineId: string;
  lineName: string;
  name: string;
  phone: string | null;
  email: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  email?: string;
}

// 後端標準回應格式
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 取得目前登入使用者的 Profile
 */
export async function getUserProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Get profile error:", response.status, errorText);
    throw new Error(`取得使用者資料失敗 (${response.status})`);
  }

  const result = await response.json();
  console.log("Get profile response:", result);
  
  // 處理包裝格式 { success, message, data } 或直接回傳資料
  if (result.success !== undefined && result.data) {
    return result.data as UserProfile;
  }
  return result as UserProfile;
}

/**
 * 更新目前登入使用者的 Profile
 */
export async function updateUserProfile(token: string, data: UpdateUserRequest): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update profile error:", response.status, errorText);
    throw new Error(`更新使用者資料失敗 (${response.status})`);
  }

  const result = await response.json();
  console.log("Update profile response:", result);
  
  // 處理包裝格式 { success, message, data } 或直接回傳資料
  if (result.success !== undefined && result.data) {
    return result.data as UserProfile;
  }
  return result as UserProfile;
}
