import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/utils/toast";
import {
  BadgeCheck,
  BarChart2,
  Cog,
  DollarSign,
  FileText,
  Home,
  LogOut,
  Menu,
  Package,
  Receipt,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
            "hover:bg-primary/10 hover:text-primary",
            isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground",
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
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden w-72 flex-col border-r bg-white p-6 lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <BadgeCheck className="h-6 w-6 text-primary" />
          <div>
            <p className="text-lg font-semibold text-primary">
              Oficina Pro
            </p>
            <p className="text-sm text-muted-foreground">
              Gestão completa
            </p>
          </div>
        </div>

        <SidebarContent />

        <div className="mt-auto space-y-3 pt-6">
          <div className="rounded-md border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">Usuário logado</p>
            <p className="truncate text-sm font-medium">
              {user?.email ?? "Conta"}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm lg:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="px-6 py-4 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    Oficina Pro
                  </SheetTitle>
                </SheetHeader>
                <div className="px-6 pb-6">
                  <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
                  <div className="mt-6 space-y-3">
                    <div className="rounded-md border bg-slate-50 p-3">
                      <p className="text-xs text-muted-foreground">Usuário logado</p>
                      <p className="truncate text-sm font-medium">
                        {user?.email ?? "Conta"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                SaaS Gestão de Oficinas
              </p>
              <h1 className="text-xl font-semibold text-slate-900">
                Plataforma administrativa
              </h1>
            </div>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm">
              {user?.email ?? "Conta"}
            </div>
            <Button variant="outline" className="gap-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};