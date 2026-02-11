import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Users, 
  User, 
  Settings, 
  Plus,
  BookOpen,
  CreditCard,
  Trophy,
  Map
} from "lucide-react";

const sitemapSections = [
  {
    title: "主要頁面",
    icon: Home,
    links: [
      { label: "首頁", href: "/", description: "網站首頁，瀏覽最新活動" },
      { label: "找活動", href: "/activities", description: "搜尋並參加各種運動活動" },
    ]
  },
  {
    title: "球團功能",
    icon: Users,
    links: [
      { label: "我的球團", href: "/club", description: "查看您的球團" },
      { label: "建立球團", href: "/club/new", description: "創建新的運動球團" },
      { label: "活動管理", href: "/club/activities", description: "管理球團活動" },
      { label: "成員管理", href: "/club/members", description: "管理球團成員" },
      { label: "收款管理", href: "/club/payments", description: "處理球團收款" },
      { label: "計分紀錄", href: "/club/scores", description: "記錄比賽分數" },
    ]
  },
  {
    title: "建立功能",
    icon: Plus,
    links: [
      { label: "開新活動", href: "/club/new-activity", description: "建立新的運動活動" },
      { label: "建立課程", href: "/course/new", description: "建立運動教學課程" },
    ]
  },
  {
    title: "會員中心",
    icon: User,
    links: [
      { label: "個人資料", href: "/profile", description: "編輯個人資訊" },
      { label: "管理後台", href: "/admin", description: "系統管理功能" },
    ]
  },
  {
    title: "支援與資訊",
    icon: BookOpen,
    links: [
      { label: "幫助中心", href: "/help", description: "常見問題與使用說明" },
      { label: "隱私政策", href: "/privacy", description: "隱私權保護說明" },
      { label: "使用條款", href: "/terms", description: "網站使用規範" },
    ]
  },
];

export default function Sitemap() {
  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Map className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">網站導覽</h1>
          </div>
          <p className="text-muted-foreground">快速找到您需要的功能與頁面</p>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemapSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="w-5 h-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link 
                          to={link.href}
                          className="block group"
                        >
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {link.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {link.description}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
