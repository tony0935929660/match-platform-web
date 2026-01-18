const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 建立活動請求
export interface CreateMatchRequest {
  name: string;           // 活動名稱
  court: string;          // 場地名稱
  area: number;           // 地區 (enum value)
  sport: number;          // 運動類型 (enum value)
  address: string;        // 詳細地址
  dateTime: string;       // 開始日期時間 (ISO 8601)
  endDateTime: string;    // 結束日期時間 (ISO 8601)
  price: number;          // 費用
  unit: number;           // 計費單位 (1 = 每人)
  groupId?: number | null; // 球團 ID
  requiredPeople: number; // 名額上限
  maxGrade: number;       // 等級上限
  minGrade: number;       // 等級下限
  remark?: string;        // 活動說明
  isGuestPlayerAllowed?: boolean; // 是否開放臨打
  guestPlayerJoinBeforeStartMinutes?: number; // 開放報名前時間（分鐘）
  isScoreRecordEnabled?: boolean; // 計分模式是否開啟
}

// 活動回應
export interface MatchResponse {
  id: number;
  name: string;
  court: string;
  area: number;
  sport: number;
  address: string;
  dateTime: string;
  endDateTime: string;
  price: number;
  unit: number;
  groupId?: number | null;
  groupName?: string | null;
  requiredPeople: number;
  maxGrade: number;
  minGrade: number;
  remark?: string;
  isGuestPlayerAllowed?: boolean;
  guestPlayerJoinBeforeStartMinutes?: number;
  isScoreRecordEnabled?: boolean;
  userRole?: number; // 0: None, 1: Viewer, 2: Participant, 3: Host
  createdAt: string;
  updatedAt: string;
}

/**
 * 取得活動詳情
 */
export async function getMatch(token: string, id: string): Promise<MatchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/matches/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`取得活動詳情失敗 (${response.status})`);
  }

  const result = await response.json();
  console.log("Get match response:", result);
  
  if (result.success !== undefined && result.data) {
    return result.data as MatchResponse;
  }
  return result as MatchResponse;
}


// 後端標準回應格式
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 建立新活動
 */
export async function createMatch(token: string, data: CreateMatchRequest): Promise<MatchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/matches`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Create match error:", response.status, errorText);
    
    let errorMessage = "建立活動失敗";
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
  console.log("Create match response:", result);
  
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as MatchResponse;
  }
  return result as MatchResponse;
}

// 分頁回應結構
export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface GetMatchesParams {
  area?: number;
  date?: string;
  keyword?: string;
  sport?: number;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * 取得活動列表
 */
export async function getMatches(token?: string, params?: GetMatchesParams): Promise<PageResponse<MatchResponse>> {
  const searchParams = new URLSearchParams();
  if (params?.area) searchParams.append("area", String(params.area));
  if (params?.date) searchParams.append("date", params.date);
  if (params?.keyword) searchParams.append("keyword", params.keyword);
  if (params?.sport) searchParams.append("sport", String(params.sport));
  if (params?.pageNumber !== undefined) searchParams.append("pageNumber", String(params.pageNumber));
  if (params?.pageSize !== undefined) searchParams.append("pageSize", String(params.pageSize));

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/matches${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`取得活動列表失敗 (${response.status})`);
  }

  const result = await response.json();
  console.log("Get matches response:", result);
  
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as PageResponse<MatchResponse>;
  }
  // 如果直接回傳 PageResponse
  return result as PageResponse<MatchResponse>;
}

/**
 * 加入活動
 */
export async function joinMatch(token: string, id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/matches/${id}/join`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`加入活動失敗 (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  return result.success;
}

/**
 * 離開活動
 */
export async function leaveMatch(token: string, id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/matches/${id}/leave`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`離開活動失敗 (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  return result.success;
}



