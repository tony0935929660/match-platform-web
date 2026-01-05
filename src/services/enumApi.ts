const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 運動類型枚舉
export interface SportEnum {
  value: number;
  name: string;
  displayName: string;
  validGrades: number[]; // 可用的等級列表
}

// 地區枚舉
export interface AreaEnum {
  value: number;
  name: string;
  displayName: string;
}

// 計費單位枚舉
export interface BillingUnitEnum {
  value: number;
  name: string;
  displayName: string;
}

// 後端標準回應格式
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 取得運動類型列表
 */
export async function getSports(): Promise<SportEnum[]> {
  const response = await fetch(`${API_BASE_URL}/api/enums/sports`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`取得運動類型失敗 (${response.status})`);
  }

  const result = await response.json();
  console.log("Sports enum response:", result);
  
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as SportEnum[];
  }
  return result as SportEnum[];
}

/**
 * 取得地區列表
 */
export async function getAreas(): Promise<AreaEnum[]> {
  const response = await fetch(`${API_BASE_URL}/api/enums/areas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`取得地區列表失敗 (${response.status})`);
  }

  const result = await response.json();
  console.log("Areas enum response:", result);
  
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as AreaEnum[];
  }
  return result as AreaEnum[];
}

/**
 * 取得計費單位列表
 */
export async function getBillingUnits(): Promise<BillingUnitEnum[]> {
  const response = await fetch(`${API_BASE_URL}/api/enums/billing-units`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`取得計費單位失敗 (${response.status})`);
  }

  const result = await response.json();
  console.log("Billing units enum response:", result);
  
  // 處理包裝格式
  if (result.success !== undefined && result.data) {
    return result.data as BillingUnitEnum[];
  }
  return result as BillingUnitEnum[];
}
