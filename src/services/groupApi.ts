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
    
    throw new Error(errorMessage);
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
    throw new Error("取得球團列表失敗");
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
    throw new Error("取得球團詳情失敗");
  }

  const result = await response.json();
  console.log("Get group response:", result);
  
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as GroupResponse;
  }
  return result as GroupResponse;
}

// 更新球團請求
export interface UpdateGroupRequest {
  name?: string;           // 球團名稱
  sport?: number;          // 運動類型 (enum value)
  description?: string;    // 球團簡介
  court?: string;          // 活動地點
  address?: string;        // 活動地址
  phone?: string;          // 聯絡電話
  email?: string;          // 電子郵件
  websiteUrl?: string;     // 網站連結
}

/**
 * 更新球團資料
 */
export async function updateGroup(token: string, id: number, data: UpdateGroupRequest): Promise<GroupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "更新球團失敗";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.title || errorMessage;
    } catch {}
    throw new Error(`${errorMessage} (${response.status})`);
  }

  const result = await response.json();
  if (result.success !== undefined && result.data) {
    return result.data as GroupResponse;
  }
  return result as GroupResponse;
}

/**
 * 刪除球團
 */
export async function deleteGroup(token: string, id: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "刪除球團失敗";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.title || errorMessage;
    } catch {}
    throw new Error(`${errorMessage} (${response.status})`);
  }

  const result = await response.json();
  return result.success !== false;
}

// 成員回應
export interface GroupMemberResponse {
  userId: number;
  userName: string;
  lineName: string;
  phone: string | null;
  email: string | null;
  role: number; // 1: Member, 2: Admin
  joinedAt: string;
}

/**
 * 取得球團成員列表
 */
export async function getGroupMembers(token: string, groupId: number): Promise<GroupMemberResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/members`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`取得成員列表失敗 (${response.status})`);
  }

  const result = await response.json();
  if (result.success !== undefined && result.data) {
    return result.data as GroupMemberResponse[];
  }
  return result as GroupMemberResponse[];
}

/**
 * 更新成員角色
 */
export async function updateMemberRole(token: string, groupId: number, targetUserId: number, role: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/members/${targetUserId}/role`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = "更新成員角色失敗";
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) errorMsg = errorJson.message;
    } catch {}
    throw new Error(errorMsg);
  }

  const result = await response.json();
  return result.success !== false;
}

/**
 * 移除成員
 */
export async function removeMember(token: string, groupId: number, targetUserId: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/members/${targetUserId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = "移除成員失敗";
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) errorMsg = errorJson.message;
    } catch {}
    throw new Error(errorMsg);
  }

  const result = await response.json();
  return result.success !== false;
}

// 邀請連結回應
export interface InviteLinkResponse {
  id: number;
  groupId: number;
  code: string;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  isExpired: boolean;
  isMaxUsesReached: boolean;
  isValid: boolean;
  note?: string;
  createdByUserId: number;
  createdByUserName: string;
  createdAt: string;
}

export interface CreateInviteLinkRequest {
  expiresAt?: string;
  maxUses?: number;
  note?: string;
}

/**
 * 建立邀請連結
 */
export async function createInviteLink(token: string, groupId: string, data?: CreateInviteLinkRequest): Promise<InviteLinkResponse> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/invite-links`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data || {}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Create invite link error:", response.status, errorText);
    
    let errorMessage = "建立邀請連結失敗";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.title || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    
    throw new Error(errorMessage);
  }

  const result = await response.json();
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as InviteLinkResponse;
  }
  return result as InviteLinkResponse;
}

/**
 * 透過邀請連結加入球團
 */
export async function joinGroupByLink(token: string, inviteCode: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/groups/join-by-link`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // 後端要求 { "inviteCode": "..." }
    body: JSON.stringify({ inviteCode }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Join group error:", response.status, errorText);
    
    let errorMessage = "加入球團失敗";
    try {
        const errorJson = JSON.parse(errorText);
        // 如果有 message 並且是明確的業務錯誤訊息，直接使用
        if (errorJson.message) {
            errorMessage = errorJson.message;
        } else {
            errorMessage = errorJson.title || errorMessage;
        }
    } catch {
        if (errorText) errorMessage = errorText;
    }
    
    // 如果是 409 Conflict (e.g. 已加入)，通常 message 已經很清楚，不需要加上 status code
    if (response.status === 409) {
         throw new Error(errorMessage);
    }
    
    throw new Error(errorMessage);
  }

  const result = await response.json();
  
  if (result.success !== undefined) {
      if (!result.success) {
          throw new Error(result.message || "加入失敗");
      }
      return result.success;
  }
  return true;
}

/**
 * 手動邀請成員加入球團
 */
export async function addMemberToGroup(token: string, groupId: string, userPublicId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userPublicId }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Parse error if possible
    let errorMsg = `邀請成員失敗 (${response.status})`;
    try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) errorMsg = errorJson.message;
    } catch {}
    
    throw new Error(errorMsg);
  }

  const result = await response.json();
  return result.success;
}

// 繳費紀錄請求
export interface CreatePaymentRequest {
  userId: number;
  paymentType: number;
  amount: number;
  remark?: string;
  paymentDate?: string;
  startDate?: string;
  endDate?: string;
}

// 繳費紀錄回應
export interface PaymentResponse {
  id: number;
  userId: number;
  userName: string;
  paymentType: number;
  paymentTypeName: string;
  amount: number;
  remark: string | null;
  paymentDate: string;
  startDate: string | null;
  endDate: string | null;
  status: number;
  statusName: string;
  createdAt: string;
}

/**
 * 新增繳費紀錄
 */
export async function createPayment(token: string, groupId: number, data: CreatePaymentRequest): Promise<PaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/payments`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `新增繳費紀錄失敗 (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) errorMsg = errorJson.message;
    } catch {}
    throw new Error(errorMsg);
  }

  const result = await response.json();
  if (result.success !== undefined && result.data) {
    return result.data as PaymentResponse;
  }
  return result as PaymentResponse;
}

/**
 * 取得球團繳費紀錄列表
 */
export async function getGroupPayments(token: string, groupId: number): Promise<PaymentResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/groups/${groupId}/payments`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`取得繳費紀錄失敗 (${response.status})`);
  }

  const result = await response.json();
  if (result.success !== undefined && result.data) {
    return result.data as PaymentResponse[];
  }
  return result as PaymentResponse[];
}