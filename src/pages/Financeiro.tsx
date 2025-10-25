import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";

const Financeiro = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe receitas, despesas, contas a pagar e saldo consolidado.
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
            <p className="text-2xl font-bold text-slate-900">R$ 0,00</p>
            <CardDescription>Mês atual</CardDescription>
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
            <p className="text-2xl font-bold text-slate-900">R$ 0,00</p>
            <CardDescription>Mês atual</CardDescription>
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
            <p className="text-2xl font-bold text-slate-900">R$ 0,00</p>
            <CardDescription>Mês atual</CardDescription>
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
            <p className="text-2xl font-bold text-slate-900">0</p>
            <CardDescription>Alertas pendentes</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receitas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="contas">Contas a pagar</TabsTrigger>
        </TabsList>
        <TabsContent value="receitas">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Centro de receitas
              </CardTitle>
              <CardDescription>
                Integre vendas, receitas externas e categorias personalizadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Em breve: gráficos de evolução, filtros por período e exportação.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="despesas">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Controle de despesas
              </CardTitle>
              <CardDescription>
                Cadastre fornecedores, acompanhe status e saiba para onde o dinheiro vai.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Em breve: alertas automáticos de vencimento e relatórios por categoria.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contas">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Contas a pagar
              </CardTitle>
              <CardDescription>
                Visualize compromissos futuros e mantenha sua oficina sempre em dia.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Em breve: calendário interativo, marcações rápidas e integração com notificações.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;