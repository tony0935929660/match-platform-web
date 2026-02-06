/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LINE_CHANNEL_ID: string;
  readonly VITE_LINE_REDIRECT_URI?: string;
  readonly VITE_API_BASE_URL: string;
  // 注意：VITE_LINE_CHANNEL_SECRET 已移除
  // Channel Secret 應該只存在於後端環境變數中，不應該暴露在前端
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
