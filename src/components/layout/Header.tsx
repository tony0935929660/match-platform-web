import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  User, 
  Menu,
  Home,
  Calendar,
  Users,
  Settings,
  Plus,
  UsersRound,
  BookOpen,
  LogOut,
  LogIn
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "首頁", href: "/", icon: Home },
  { label: "找活動", href: "/activities", icon: Calendar },
  { label: "找課程", href: "/courses", icon: BookOpen },
  { label: "球團管理", href: "/club", icon: Users },
  { label: "課程管理", href: "/course", icon: BookOpen },
];

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-xl">🏸</span>
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:block">揪團GO</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Create Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/club/new">
              <Button variant="outline" size="sm" className="gap-1.5">
                <UsersRound className="h-4 w-4" />
                建立球團
              </Button>
            </Link>
            <Link to="/course/new">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BookOpen className="h-4 w-4" />
                建立課程
              </Button>
            </Link>
          </div>
          
          {/* New Activity Button */}
          <Link to="/activities/new">
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5">
              <Plus className="h-4 w-4" />
              開團
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
          </Button>
          
          {/* User Dropdown - Desktop */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.pictureUrl} alt={user?.displayName} />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.displayName}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    會員中心
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/club" className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    球團管理
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/course" className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    課程管理
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    管理後台
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button variant="default" size="sm" className="gap-1.5">
                <LogIn className="h-4 w-4" />
                登入
              </Button>
            </Link>
          )}
          
          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
                
                <div className="h-px bg-border my-2" />
                
                {/* Create Actions - Mobile */}
                <Link
                  to="/activities/new"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <Plus className="h-5 w-5" />
                  開新活動
                </Link>
                <Link
                  to="/club/new"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <UsersRound className="h-5 w-5" />
                  建立球團
                </Link>
                <Link
                  to="/course/new"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <BookOpen className="h-5 w-5" />
                  建立課程
                </Link>
                
                <div className="h-px bg-border my-2" />
                
                {isAuthenticated ? (
                  <>
                    {user && (
                      <div className="flex items-center gap-3 px-4 py-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.pictureUrl} alt={user.displayName} />
                          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{user.displayName}</span>
                      </div>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <User className="h-5 w-5" />
                      會員中心
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <Settings className="h-5 w-5" />
                      管理後台
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      登出
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <LogIn className="h-5 w-5" />
                    登入
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
