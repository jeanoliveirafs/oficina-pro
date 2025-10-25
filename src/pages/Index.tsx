import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, Package, Users, TrendingUp } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";

const Index = () => {
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
              Faturamento Total
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">R$ 0,00</p>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês passado
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
            <p className="text-3xl font-bold text-foreground">0</p>
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
            <p className="text-3xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">
              Produtos com estoque baixo
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Novos Clientes
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês passado
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

      <div className="flex justify-end">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;