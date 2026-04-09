const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ScoreRecordRequest {
  matchId: number;
  teamHomeScore: number;
  teamHomePlayers: number[];
  teamGuestScore: number;
  teamGuestPlayers: number[];
}

export interface ScoreRecordResponse {
  id: number;
  matchId: number;
  teamHomeScore: number;
  teamHomePlayers: number[];
  teamHomePlayerNames: string[];
  teamGuestScore: number;
  teamGuestPlayers: number[];
  teamGuestPlayerNames: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 新增比賽紀錄
 */
export async function createScoreRecord(token: string, data: ScoreRecordRequest): Promise<ScoreRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/api/score-records`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `新增比分失敗 (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) errorMsg = errorJson.message;
    } catch {}
    throw new Error(errorMsg);
  }

  const result = await response.json();
  if (result.success !== undefined && result.data) {
    return result.data as ScoreRecordResponse;
  }
  return result as ScoreRecordResponse;
}

/**
 * 取得比賽紀錄列表
 */
export async function getScoreRecords(token: string, matchId?: number): Promise<ScoreRecordResponse[]> {
  if (!matchId) return [];

  const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}/score-records`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("取得比賽紀錄失敗");
  }

  const result = await response.json();
  // Assume backend returns array directly or inside data
  if (Array.isArray(result)) {
      return result;
  }
  if (result.success !== undefined && result.data) {
    return result.data as ScoreRecordResponse[];
  }
  return [];
}

/**
 * 刪除比賽紀錄
 */
export async function deleteScoreRecord(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/score-records/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("刪除比賽紀錄失敗");
  }
}

