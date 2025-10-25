import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/utils/toast";
import {
  BadgeCheck,
  BarChart2,
  Cog,
  DollarSign,
  Home,
  LogOut,
  Menu,
  Package,
  Receipt,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Notifications } from "./Notifications";

const navItems = [
  { label: "Dashboard", icon: Home, to: "/" },
  { label: "Vendas", icon: ShoppingCart, to: "/vendas" },
  { label: "Produtos", icon: Package, to: "/produtos" },
  { label: "Clientes", icon: Users, to: "/clientes" },
  { label: "Orçamentos", icon: Receipt, to: "/orcamentos" },
  { label: "Financeiro", icon: DollarSign, to: "/financeiro" },
  { label: "Relatórios", icon: BarChart2, to: "/relatorios" },
  { label: "Configurações", icon: Cog, to: "/configuracoes" },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
  <nav className="flex flex-col gap-1">
    {navItems.map(({ label, icon: Icon, to }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground",
          )
        }
        onClick={onNavigate}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export const AppLayout = () => {
  const { user } = useSession();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Não foi possível encerrar a sessão.");
      return;
    }
    showSuccess("Sessão encerrada com sucesso.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 flex-col border-r border-border/60 bg-card p-4 lg:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <BadgeCheck className="h-7 w-7 text-primary" />
          <p className="text-xl font-bold text-foreground">Oficina Pro</p>
        </div>

        <div className="flex-1">
          <SidebarContent />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/60 bg-card px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-card p-0">
                <SheetHeader className="p-4 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <BadgeCheck className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold">Oficina Pro</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="hidden text-xl font-semibold text-foreground md:block">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Notifications />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 rounded-full p-1"
                >
                  <div className="hidden text-right lg:block">
                    <p className="text-sm font-medium text-foreground">
                      {user?.email?.split("@")[0] ?? "Usuário"}
                    </p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                  <User className="h-8 w-8 rounded-full border border-border/60 p-1.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.email?.split("@")[0] ?? "Usuário"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};