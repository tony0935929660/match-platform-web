import liff from "@line/liff";

let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * 初始化 LIFF SDK（單例，只執行一次）
 */
export async function initLiff(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  const liffId = import.meta.env.VITE_LIFF_ID;
  if (!liffId) {
    console.warn("VITE_LIFF_ID is not set, skipping LIFF init");
    return;
  }

  initPromise = liff.init({ liffId }).then(() => {
    initialized = true;
    // 在 LIFF 瀏覽器內且尚未登入時，觸發靜默登入
    if (liff.isInClient() && !liff.isLoggedIn()) {
      liff.login();
    }
  });

  return initPromise;
}

/**
 * 是否在 LINE LIFF 瀏覽器內開啟
 */
export function isInLiff(): boolean {
  return liff.isInClient();
}

/**
 * 取得 LIFF ID Token（用於後端驗證使用者身份）
 */
export function getLiffIdToken(): string | null {
  return liff.getIDToken();
}
