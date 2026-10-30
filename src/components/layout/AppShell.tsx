/**
 * The frame of the whole app. Three layouts, chosen with the `layout` prop:
 *
 *   "sidebar"  a side menu with the app's pages, and a top bar with a button that
 *              opens the menu on small screens. For apps with several screens.
 *   "topbar"   the pages as links along the top. For a few screens and wide content.
 *   "focused"  one centered column and no menu. For a single-purpose tool or form.
 *
 * Use the layout named in the approved blueprint. With none named, use "sidebar".
 * Use AppShell ONCE, in src/App.tsx, around the routes:
 *
 *   <AppShell layout="sidebar" appName="Consultant Hub" nav={[
 *     { label: "Dashboard", href: "/", icon: LayoutDashboard },
 *     { label: "Consultants", href: "/consultants", icon: Users },
 *   ]}>
 *     <Routes>...</Routes>
 *   </AppShell>
 *
 * Every page inside it starts with <PageHeader> inside <PageContainer>. Add a page
 * by adding one entry to `nav` and one <Route>. Icons come from "@/lib/icons".
 * `nav` is not used by "focused".
 */
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export type AppLayout = "sidebar" | "topbar" | "focused";

interface ShellProps {
  appName: string;
  /** A small mark beside the name, such as <img src="/logo.svg" className="size-6" />. */
  logo?: ReactNode;
  nav?: NavItem[];
  /** Shown at the bottom of the sidebar ("sidebar" only), such as the signed-in user. */
  footer?: ReactNode;
  /** Shown at the right of the top bar, such as a search box or an account menu. */
  topBar?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  layout = "sidebar",
  ...props
}: ShellProps & { layout?: AppLayout }) {
  if (layout === "topbar") return <TopBarLayout {...props} />;
  if (layout === "focused") return <FocusedLayout {...props} />;
  return <SidebarLayout {...props} />;
}

function useActive() {
  const { pathname } = useLocation();
  return (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLayout({
  appName,
  logo,
  nav = [],
  footer,
  topBar,
  children,
}: ShellProps) {
  const isActive = useActive();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 py-4">
          <div className="flex items-center gap-2 font-semibold">
            {logo}
            <span className="truncate">{appName}</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="ml-auto flex items-center gap-2">{topBar}</div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

function TopBarLayout({
  appName,
  logo,
  nav = [],
  topBar,
  children,
}: ShellProps) {
  const isActive = useActive();
  const links = nav.map((item) => (
    <Link
      key={item.href}
      to={item.href}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        isActive(item.href) && "bg-accent text-accent-foreground",
      )}
    >
      <item.icon className="size-4" />
      {item.label}
    </Link>
  ));
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-semibold">
            {logo}
            <span className="truncate">{appName}</span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">{links}</nav>
          <div className="ml-auto flex items-center gap-2">{topBar}</div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {links}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

function FocusedLayout({ appName, logo, topBar, children }: ShellProps) {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            {logo}
            <span className="truncate">{appName}</span>
          </div>
          <div className="flex items-center gap-2">{topBar}</div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl">{children}</main>
    </div>
  );
}
