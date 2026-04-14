import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <MainLayout>
      <div className="container max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">隱私權政策</h1>
        <p className="text-sm text-muted-foreground mb-10">
          最後更新日期：2026 年 4 月 14 日
        </p>

        <section className="prose prose-sm dark:prose-invert max-w-none space-y-10">

          {/* 1 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">一、前言與適用範圍</h2>
            <p className="text-muted-foreground leading-relaxed">
              山林工作室（以下稱「本工作室」、「我們」）營運「揪團GO」運動揪團平台（以下稱「本平台」）。
              本隱私權政策依據中華民國《個人資料保護法》（以下稱「個資法」）及相關法規制定，
              說明我們如何蒐集、處理、利用及保護您的個人資料。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              本政策適用於您透過本平台（
              <a href="https://jolly-rock-0ce854300.2.azurestaticapps.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://jolly-rock-0ce854300.2.azurestaticapps.net/
              </a>
              ）及相關服務進行的所有互動。使用本平台即表示您已閱讀、理解並同意本政策的全部內容。
            </p>
          </div>

          {/* 2 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">二、蒐集之個人資料種類</h2>
            <p className="text-muted-foreground leading-relaxed">
              本平台透過 LINE 登入（LINE Login / LIFF）取得以下資料：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>LINE 使用者識別碼（User ID）</li>
              <li>顯示名稱（Display Name）</li>
              <li>大頭貼圖片網址（Profile Picture URL）</li>
              <li>電子郵件地址（Email，僅在您授權時取得）</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              此外，當您使用本平台功能時，我們也會記錄：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>您建立或參加的活動資訊（運動種類、場次、時間、地點）</li>
              <li>您所屬球團及成員身份資訊</li>
              <li>活動參與紀錄與積分資訊</li>
              <li>您主動填寫的個人運動技能等級</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              我們亦自動蒐集以下技術性資料：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>IP 位址、瀏覽器類型與版本</li>
              <li>存取時間與頁面瀏覽紀錄</li>
              <li>Cookie 及類似技術產生的識別資料（詳見第八條）</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              我們不主動蒐集敏感性個人資料（如身分證字號、醫療資訊、財務帳號等），請勿主動提供。
            </p>
          </div>

          {/* 3 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">三、蒐集目的與法律依據</h2>
            <p className="text-muted-foreground leading-relaxed">
              我們依個資法第 15 條及第 19 條，基於下列目的蒐集並利用您的個人資料：
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted-foreground border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium text-foreground w-1/3">蒐集目的</th>
                    <th className="text-left py-2 font-medium text-foreground">說明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2 pr-4 align-top">帳號識別與驗證</td>
                    <td className="py-2 align-top">透過 LINE 帳號確認您的身份，使您得以登入及使用平台功能。</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 align-top">服務提供</td>
                    <td className="py-2 align-top">建立與管理活動、球團，顯示成員資訊、活動紀錄及積分。</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 align-top">服務通知</td>
                    <td className="py-2 align-top">透過 LINE 官方帳號或平台推送活動提醒、重要公告。</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 align-top">服務改善</td>
                    <td className="py-2 align-top">分析使用行為（匿名彙整），優化平台功能與使用者體驗。</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 align-top">法律義務遵循</td>
                    <td className="py-2 align-top">於法令要求時，履行相關申報、配合調查等義務。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">四、個人資料的利用與共享</h2>
            <p className="text-muted-foreground leading-relaxed">
              除下列情形外，我們不會將您的個人資料出售、出租或以其他商業目的提供給第三方：
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">LINE 株式會社</span>：
                本平台使用 LINE Login 與 LIFF 服務，您的帳號資料透過 LINE 官方 API 取得。
                LINE 的隱私權政策請參閱
                <a href="https://terms.line.me/line_rules" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mx-1">LINE 使用者協議</a>。
              </li>
              <li>
                <span className="font-medium text-foreground">Microsoft Azure</span>：
                本站託管於 Microsoft Azure Static Web Apps，相關基礎設施資料受 Microsoft 隱私權政策保護。
              </li>
              <li>
                <span className="font-medium text-foreground">法律要求</span>：
                當法院、檢察機關或主管機關依法要求時，我們將依規定配合揭露必要資料。
              </li>
              <li>
                <span className="font-medium text-foreground">球團管理員</span>：
                當您加入某一球團時，該球團管理員將可看見您的顯示名稱、大頭貼及活動參與紀錄等資訊。
              </li>
            </ul>
          </div>

          {/* 5 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">五、個人資料保存期限</h2>
            <p className="text-muted-foreground leading-relaxed">
              您的個人資料將保存至您申請刪除帳號，或本平台停止服務為止。
              若法令另有規定保存期限者，從其規定。
            </p>
          </div>

          {/* 6 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">六、個人資料安全措施</h2>
            <p className="text-muted-foreground leading-relaxed">
              我們採取以下技術及管理措施保護您的個人資料：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>全站採 HTTPS 加密傳輸（TLS 1.2 以上）</li>
              <li>後端 API 使用存取權杖（Token）驗證，避免未授權存取</li>
              <li>資料庫設有存取控制，僅授權人員可存取</li>
              <li>定期檢視系統日誌，監控異常存取行為</li>
              <li>不在前端程式碼中儲存或暴露敏感金鑰</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              儘管如此，網際網路傳輸並無法保證100%安全。若發生資料洩漏事件，我們將依個資法第 12 條規定，於知悉後通知受影響之當事人，並向主管機關報告。
            </p>
          </div>

          {/* 7 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">七、您的個人資料權利</h2>
            <p className="text-muted-foreground leading-relaxed">
              依據個資法，您得隨時透過電子郵件聯絡我們，要求查詢、更正或刪除您的個人資料。
              我們將於收到請求後盡速處理。
            </p>
          </div>

          {/* 8 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">八、Cookie 與追蹤技術</h2>
            <p className="text-muted-foreground leading-relaxed">
              本平台使用 Cookie 及本機儲存（LocalStorage）技術，用途如下：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><span className="font-medium text-foreground">必要性 Cookie</span>：維持您的登入狀態與工作階段安全。</li>
              <li><span className="font-medium text-foreground">功能性 Cookie</span>：記憶您的偏好設定（如語言、主題）。</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              本平台目前不使用廣告追蹤或跨網站追蹤 Cookie。
              您可透過瀏覽器設定管理 Cookie，但停用必要性 Cookie 將造成部分功能無法正常運作。
            </p>
          </div>

          {/* 10 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">十、政策變更</h2>
            <p className="text-muted-foreground leading-relaxed">
              我們可能因應法規修訂或服務調整而更新本政策。更新後將於本頁面公告，
              重大變更將透過平台通知提醒您。
              建議您定期閱覽本頁面以掌握最新政策。
              於政策更新後繼續使用本平台，即視為同意修訂後的內容。
            </p>
          </div>

          {/* 11 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">十一、聯絡我們</h2>
            <p className="text-muted-foreground leading-relaxed">
              若您對本隱私權政策有任何疑問，或欲行使個資法所賦予之權利，請透過以下方式聯絡我們：
            </p>
            <div className="bg-secondary/40 rounded-lg p-4 space-y-1 text-sm">
              <p><span className="font-medium">名稱：</span>山林工作室</p>
              <p>
                <span className="font-medium">電子郵件：</span>
                <a href="mailto:shanlink42@gmail.com" className="text-primary hover:underline">shanlink42@gmail.com</a>
              </p>
            </div>
          </div>

        </section>

        <div className="mt-12 pt-8 border-t border-border flex gap-4 text-sm">
          <Link to="/terms" className="text-primary hover:underline">使用條款</Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">回首頁</Link>
        </div>
      </div>
    </MainLayout>
  );
}
