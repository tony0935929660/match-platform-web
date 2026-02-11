const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ScoreRecordRequest {
  matchId: number;
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
}

export interface ScoreRecordResponse {
  id: number;
  matchId: number;
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 新增比賽紀錄
 */
export async function createScoreRecord(token: string, data: ScoreRecordRequest): Promise<ScoreRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ScoreRecord`, {
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
 * 取得活動的比賽紀錄 (如果 API 有提供，目前假設 GET /api/ScoreRecord?matchId=...)
 * 暫時保留，若之後有需要查詢特定活動的比分
 */
/*
export async function getScoreRecords(token: string, matchId: number): Promise<ScoreRecordResponse[]> {
  // Implementation depends on backend API availability
}
*/
