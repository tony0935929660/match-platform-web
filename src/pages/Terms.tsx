import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <MainLayout>
      <div className="container max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">服務條款</h1>
        <p className="text-sm text-muted-foreground mb-10">
          最後更新日期：2026 年 4 月 14 日
        </p>

        <section className="prose prose-sm dark:prose-invert max-w-none space-y-10">

          {/* 1 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">一、接受條款</h2>
            <p className="text-muted-foreground leading-relaxed">
              歡迎使用「揪團GO」（以下稱「本服務」或「本平台」），由山林工作室（以下稱「本工作室」、「我們」）營運。
              請您在使用本服務前，詳細閱讀本服務條款（以下稱「本條款」）。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              當您點選「同意」、完成社群帳號登入，或以任何方式存取或使用本服務時，即表示您已閱讀、理解並同意受本條款拘束。
              若您不同意本條款之任何內容，請立即停止使用本服務。
            </p>
          </div>

          {/* 2 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">二、服務說明</h2>
            <p className="text-muted-foreground leading-relaxed">
              揪團GO 是一個運動揪團平台，提供以下核心功能：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>建立、瀏覽及參加各類運動活動</li>
              <li>建立與管理球團（運動社群）</li>
              <li>球團成員管理與邀請</li>
              <li>活動紀錄追蹤</li>
              <li>透過 LINE 帳號快速登入</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              本平台目前為免費服務，不提供線上金流或付費功能。
              本工作室保留未來新增或調整服務項目之權利，並將於調整前以適當方式通知使用者。
            </p>
          </div>

          {/* 3 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">三、帳號使用資格</h2>
            <p className="text-muted-foreground leading-relaxed">
              使用本服務須符合以下條件：
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>提供真實、準確的個人資訊。</li>
              <li>擁有合法有效的 LINE 帳號。</li>
              <li>未曾因違反本條款而遭本平台封鎖帳號。</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              每位使用者僅限使用一個帳號。您的帳號不得轉讓或讓他人使用。
              您有責任妥善保管與您帳號相關之 LINE 登入憑證，並對帳號下的所有活動負責。
            </p>
          </div>

          {/* 4 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">四、使用者行為規範</h2>
            <p className="text-muted-foreground leading-relaxed">
              使用本服務時，您同意遵守以下規範，並不得：
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>發布虛假、誤導或詐騙性的活動資訊。</li>
              <li>騷擾、威脅、辱罵或歧視其他使用者。</li>
              <li>上傳或分享違法、色情、侵權或有害內容。</li>
              <li>未經授權存取其他使用者帳號或系統資源。</li>
              <li>使用自動化程式（Bot）、爬蟲或任何非人工方式存取本服務。</li>
              <li>嘗試干擾、破壞本平台的正常運作或安全性。</li>
              <li>將本平台用於任何非法商業或詐騙目的。</li>
              <li>蒐集或竊取其他使用者的個人資料。</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              違反上述規範者，本工作室得不另行通知，逕行暫停或終止其帳號，並保留追究法律責任之權利。
            </p>
          </div>

          {/* 5 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">五、使用者內容</h2>
            <p className="text-muted-foreground leading-relaxed">
              您在本平台上發布的活動資訊、文字描述、圖片及其他內容（以下稱「使用者內容」），
              其著作權仍歸屬於您或原著作權人所有。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              您授予本工作室一個非專屬、全球性、免授權費的授權，得使用、複製、展示及散布您的使用者內容，
              僅限於提供、改善及推廣本服務所必要的範圍內。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              您保證您所發布的使用者內容不侵害任何第三方之著作權、商標權、隱私權或其他合法權益。
              因使用者內容引發之任何糾紛或損失，由發布者自行負責。
            </p>
          </div>

          {/* 6 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">六、智慧財產權</h2>
            <p className="text-muted-foreground leading-relaxed">
              本平台的設計、介面、原始碼、商標、標誌及相關內容（使用者內容除外）之智慧財產權，
              均屬本工作室或其授權人所有。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              未經本工作室書面同意，您不得複製、修改、散布、傳輸、展示、執行、重製、公開播送、
              發行或創作衍生著作。本服務僅授予您個人、非商業性、不可轉讓的有限使用權。
            </p>
          </div>

          {/* 7 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">七、活動參與免責聲明</h2>
            <p className="text-muted-foreground leading-relaxed">
              本平台僅提供活動媒合與資訊傳遞服務，<strong>不為活動的實際執行、場地安全或活動品質負責</strong>。
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>活動舉辦人（建立者）須確保活動合法、場地安全，並對實際參與者負責。</li>
              <li>參加活動前，請自行評估個人體能狀況，並視需要購買運動意外保險。</li>
              <li>本工作室不對因參與活動所造成的人身傷亡、財物損失承擔賠償責任。</li>
              <li>使用者因活動產生之任何糾紛，應由當事人自行協商解決；本平台得提供協助，但不承擔仲裁義務。</li>
            </ul>
          </div>

          {/* 8 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">八、服務可用性與免責事項</h2>
            <p className="text-muted-foreground leading-relaxed">
              本工作室將盡合理努力維持服務的穩定運營，但<strong>不保證</strong>本服務將持續不中斷或完全無誤。
              下列情形所造成之服務中斷或損失，本工作室不承擔賠償責任：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>不可抗力事件（天災、戰爭、政府命令等）</li>
              <li>網路基礎設施或第三方服務（LINE、Azure）中斷</li>
              <li>系統維護或升級期間</li>
              <li>駭客攻擊、病毒或其他惡意程式破壞</li>
              <li>使用者設備問題或網路連線不穩定</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              在法律允許的最大範圍內，本工作室對本服務所提供的資訊及功能，係以「現況」（as-is）提供，
              不附帶任何明示或默示的保證。
            </p>
          </div>

          {/* 9 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">九、服務變更與終止</h2>
            <p className="text-muted-foreground leading-relaxed">
              本工作室保留以下權利：
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>隨時修改、暫停或終止本服務（或其任何部分），並將以合理方式提前通知。</li>
              <li>因維護或安全需要，不時中斷服務。</li>
              <li>在不另行通知的情況下，刪除違反本條款的帳號及其相關內容。</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              您得隨時透過聯絡我們（見第十二條）申請刪除帳號，以終止本合約關係。
              帳號刪除後，您的個人資料將依隱私權政策規定處理。
            </p>
          </div>

          {/* 10 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">十、第三方連結與服務</h2>
            <p className="text-muted-foreground leading-relaxed">
              本平台可能包含指向第三方網站或服務的連結（如 LINE、地圖服務等）。
              這些連結僅為提供方便，本工作室不對第三方網站的內容、隱私政策或服務品質負責。
              您存取任何第三方連結，均屬您自身風險，並應遵守該第三方之使用條款。
            </p>
          </div>

          {/* 11 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">十一、條款修訂</h2>
            <p className="text-muted-foreground leading-relaxed">
              本工作室得隨時修訂本條款，修訂後將於本頁面公告，並更新頁面頂部的「最後更新日期」。
              重大修訂將透過平台通知提前 14 日告知。
              於修訂生效後繼續使用本服務，即視為同意修訂後的條款。
            </p>
          </div>

          {/* 12 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">十二、準據法與管轄</h2>
            <p className="text-muted-foreground leading-relaxed">
              本條款之訂立、效力、解釋及履行，均依中華民國法律為準據法。
              因本條款或本服務所生之任何爭議，雙方同意以臺灣臺北地方法院為第一審管轄法院。
            </p>
          </div>

          {/* 13 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">十三、聯絡我們</h2>
            <p className="text-muted-foreground leading-relaxed">
              若您對本服務條款有任何疑問或建議，請透過以下方式聯絡我們：
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
          <Link to="/privacy" className="text-primary hover:underline">隱私權政策</Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">回首頁</Link>
        </div>
      </div>
    </MainLayout>
  );
}
