import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, Package, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const fetchDashboardData = async () => {
  const now = new Date();
  const start = format(startOfMonth(now), "yyyy-MM-dd");
  const end = format(endOfMonth(now), "yyyy-MM-dd");

  const faturamentoPromise = supabase
    .from("vendas")
    .select("valor_final")
    .eq("status", "finalizada")
    .gte("data_venda", start)
    .lte("data_venda", end);

  const orcamentosPromise = supabase
    .from("orcamentos")
    .select("id", { count: "exact" })
    .eq("status", "pendente");

  const alertasPromise = supabase
    .from("alertas_estoque")
    .select("id", { count: "exact" })
    .eq("ativo", true);

  const clientesPromise = supabase
    .from("clientes")
    .select("id", { count: "exact" })
    .gte("created_at", start)
    .lte("created_at", end);

  const [
    { data: faturamentoData, error: faturamentoError },
    { count: orcamentosCount, error: orcamentosError },
    { count: alertasCount, error: alertasError },
    { count: clientesCount, error: clientesError },
  ] = await Promise.all([
    faturamentoPromise,
    orcamentosPromise,
    alertasPromise,
    clientesPromise,
  ]);

  if (faturamentoError || orcamentosError || alertasError || clientesError) {
    console.error({ faturamentoError, orcamentosError, alertasError, clientesError });
    throw new Error("Erro ao buscar dados para o dashboard.");
  }

  const totalFaturamento = faturamentoData?.reduce((sum, v) => sum + v.valor_final, 0) ?? 0;

  return {
    totalFaturamento,
    orcamentosAbertos: orcamentosCount ?? 0,
    alertasEstoque: alertasCount ?? 0,
    novosClientes: clientesCount ?? 0,
  };
};

const Index = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard_summary"],
    queryFn: fetchDashboardData,
  });

  const formatCurrency = (value?: number) =>
    (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Visão geral e desempenho da sua oficina.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" asChild>
            <Link to="/vendas">
              Nova venda
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/orcamentos/novo">Novo Orçamento</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faturamento (Mês)
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(data?.totalFaturamento)}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Total de vendas finalizadas
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orçamentos Abertos
            </CardTitle>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/4" />
            ) : (
              <p className="text-3xl font-bold text-foreground">
                {data?.orcamentosAbertos}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação do cliente
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alertas de Estoque
            </CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/4" />
            ) : (
              <p className="text-3xl font-bold text-foreground">
                {data?.alertasEstoque}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Produtos com estoque baixo
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Novos Clientes (Mês)
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/4" />
            ) : (
              <p className="text-3xl font-bold text-foreground">
                {data?.novosClientes}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Fluxo de Caixa
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <p className="text-muted-foreground">Gráfico em breve</p>
          </CardContent>
        </Card>
        <Card className="col-span-1 border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <p className="text-muted-foreground">Nenhuma atividade</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;