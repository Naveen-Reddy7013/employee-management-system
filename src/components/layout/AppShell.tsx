/**
 * EMS AppShell – sidebar navigation with role-based menu items, user profile dropdown,
 * and light/dark theme toggle.
 *
 * Usage:
 *   <AppShell>
 *     <Routes>...</Routes>
 *   </AppShell>
 */
import { useEffect, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, CalendarCheck, Clock,
  CreditCard, BarChart3, Bell, Settings, Menu, X,
  LogOut, ChevronDown, Sun, Moon, User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { getNavigationForRole, type NavItem } from "@/utils/helpers";

// Brand logo component
function BrandLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6 text-[#31439b]", className)} fill="currentColor">
      {/* Geometric mark: stylized person icon inside a rounded shield */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fillOpacity="0.12" />
      <circle cx="12" cy="8" r="2.5" />
      <path d="M6.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Map nav items to their icon components
const iconMap: Record<string, typeof LayoutDashboard> = {
  Dashboard: LayoutDashboard,
  Employees: Users,
  Departments: Building2,
  Attendance: CalendarCheck,
  Leave: Clock,
  Payroll: CreditCard,
  Reports: BarChart3,
  Notifications: Bell,
  Settings: Settings,
};

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ems_theme') === 'dark');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ems_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Build navigation based on role
  const navItems: NavItem[] = user ? getNavigationForRole(user.role) : [];

  const isActive = (href: string) =>
    href === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname === href || location.pathname.startsWith(`${href}/`);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Generate avatar initials
  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  // Role label
  const roleLabel = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || '';

  return (
    <div className={cn("min-h-screen bg-background transition-colors", darkMode ? 'dark' : '')}>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-transform lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-14 items-center border-b px-4">
          <BrandLogo />
          <span className="ml-2 font-semibold">EMS</span>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setMobileOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = iconMap[item.title] || LayoutDashboard;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-[#31439b]/10 text-[#31439b] dark:bg-[#31439b]/20 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background transition-all lg:block",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-4">
          <BrandLogo />
          <span className="ml-2 font-semibold text-lg">Employee Management</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = iconMap[item.title] || LayoutDashboard;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-[#31439b]/10 text-[#31439b] dark:bg-[#31439b]/20 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <div className={cn(
        "min-h-screen transition-all lg:ml-64",
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <h1 className="text-sm font-semibold capitalize">
              {location.pathname === '/' || location.pathname === '/dashboard' ? 'Dashboard'
                : location.pathname.split('/').pop()?.replace(/-/g, ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>

            {/* Notifications */}
            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <Badge className="absolute -right-1 -top-1 size-4 p-0 text-[10px] lg:flex hidden">3</Badge>
              </Button>
            </Link>

            {/* User menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-full px-3 py-1.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-[#31439b] text-xs text-white">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline-block">{user.full_name}</span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.full_name}</span>
                      <span className="text-xs text-muted-foreground">{user.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <User className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
