import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLogout, useListNotifications } from "@workspace/api-client-react";
import {
  LayoutDashboard, Scale, FileText, FolderOpen, Map, Building,
  GraduationCap, Users, MessageSquare, LogOut, Bell, Search,
  User as UserIcon, Menu, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationsPanel } from "@/components/notifications-panel";
import { LanguageSelector } from "@/components/language-selector";

const MAIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rights", label: "Rights Explorer", icon: Scale },
  { href: "/complaints", label: "Complaints", icon: FileText },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/journeys", label: "Legal Journeys", icon: Map },
  { href: "/schemes", label: "Govt Schemes", icon: Building },
  { href: "/learning", label: "Learning Hub", icon: GraduationCap },
  { href: "/legalaid", label: "Find Legal Aid", icon: Users },
  { href: "/chat", label: "AI Assistant", icon: MessageSquare },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const logoutMutation = useLogout();
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: notifications } = useListNotifications();
  const unreadCount = ((notifications as any[]) || []).filter((n: any) => !n.isRead).length;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, { onSuccess: () => logout() });
  };

  const NavLinks = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col gap-1 py-4">
      {MAIN_NAV.map((item) => {
        const isActive = location.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} onClick={onNav}>
            <div className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}>
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <img src="/logo.jpeg" alt="NyayaSetu" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-serif text-base font-bold text-sidebar-foreground">NyayaSetu</span>
            </div>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3">
          <NavLinks />
        </div>
        <div className="border-t border-sidebar-border p-3">
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-14 items-center gap-3 border-b bg-card px-4 shrink-0">
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-sidebar p-0 border-r-0">
              <div className="flex h-14 items-center border-b border-sidebar-border px-4">
                <Link href="/">
                  <div className="flex items-center gap-2.5 cursor-pointer">
                    <img src="/logo.jpeg" alt="NyayaSetu" className="h-8 w-8 rounded-full object-cover" />
                    <span className="font-serif text-base font-bold text-sidebar-foreground">NyayaSetu</span>
                  </div>
                </Link>
              </div>
              <div className="px-3">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>

          {/* Search bar */}
          <div className="flex-1 max-w-sm hidden sm:flex items-center relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources, rights..."
              className="w-full bg-background pl-9 border-border h-9 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Language selector */}
            <LanguageSelector />

            {/* Notification bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={() => setNotifOpen(true)}
            >
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePhoto || ""} alt={user?.fullName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                      {user?.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePhoto || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        {user?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8" style={{ background: "hsl(38, 45%, 97%)" }}>
          {children}
        </main>
      </div>

      {/* Notifications panel */}
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
