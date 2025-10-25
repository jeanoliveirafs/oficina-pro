import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ReceitasTab } from "@/components/financeiro/ReceitasTab";
import { DespesasTab } from "@/components/financeiro/DespesasTab";
import { ContasPagarTab } from "@/components/financeiro/ContasPagarTab";

const fetchSummary = async () => {
  const now = new Date();
  const start = format(startOfMonth(now), "yyyy-MM-dd");
  const end = format(endOfMonth(now), "yyyy-MM-dd");

  const { data: receitas, error: receitasError } = await supabase
    .from("receitas")
    .select("valor")
    .gte("data", start)
    .lte("data", end);

  const { data: despesas, error: despesasError } = await supabase
    .from("despesas")
    .select("valor")
    .gte("data", start)
    .lte("data", end);

  const { data: atrasadas, error: atrasadasError } = await supabase
    .from("despesas")
    .select("valor")
    .eq("status", "atrasado");

  if (receitasError || despesasError || atrasadasError) {
    console.error(receitasError, despesasError, atrasadasError);
    throw new Error("Erro ao buscar resumo financeiro.");
  }

  const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
  const totalAtrasadas = atrasadas.reduce((sum, a) => sum + a.valor, 0);

  return {
    totalReceitas,
    totalDespesas,
    saldo: totalReceitas - totalDespesas,
    contasAtrasadas: atrasadas.length,
    totalAtrasadas,
  };
};

const Financeiro = () => {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["financeiro_summary"],
    queryFn: fetchSummary,
  });

  const formatCurrency = (value?: number) =>
    (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const monthName = format(new Date(), "MMMM", { locale: ptBR });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe receitas, despesas e o saldo consolidado da sua oficina.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
              Receitas
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : formatCurrency(summary?.totalReceitas)}
            </p>
            <CardDescription className="capitalize">{monthName}</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
              Despesas
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : formatCurrency(summary?.totalDespesas)}
            </p>
            <CardDescription className="capitalize">{monthName}</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
              Saldo
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : formatCurrency(summary?.saldo)}
            </p>
            <CardDescription className="capitalize">{monthName}</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
              Contas em atraso
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : summary?.contasAtrasadas ?? 0}
            </p>
            <CardDescription>
              {isLoading ? "..." : `Total: ${formatCurrency(summary?.totalAtrasadas)}`}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receitas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="contas">Contas a Pagar</TabsTrigger>
        </TabsList>
        <TabsContent value="receitas">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Centro de Receitas</CardTitle>
              <CardDescription>
                Gerencie todas as entradas, sejam de vendas ou externas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReceitasTab />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="despesas">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Controle de Despesas</CardTitle>
              <CardDescription>
                Cadastre e acompanhe todas as saídas financeiras da oficina.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DespesasTab />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contas">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Contas a Pagar</CardTitle>
              <CardDescription>
                Visualize compromissos futuros e mantenha sua oficina sempre em dia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContasPagarTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;