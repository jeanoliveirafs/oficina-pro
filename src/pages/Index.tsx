import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, Package, Users } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Olá! Bem-vindo de volta
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Resumo da sua oficina hoje
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acompanhe vendas, estoque e finanças em tempo real. Use os atalhos para acelerar o dia a dia.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" asChild>
            <Link to="/vendas">
              Nova venda
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/financeiro">Ver financeiro</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Faturamento do dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">R$ 0,00</p>
            <p className="text-xs text-muted-foreground">
              Atualize sua primeira venda para visualizar aqui.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Orçamentos abertos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">0</p>
              <p className="text-xs text-muted-foreground">
                Converta orçamentos em vendas e aumente a receita.
              </p>
            </div>
            <ClipboardList className="h-10 w-10 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Produtos com alerta
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">0</p>
              <p className="text-xs text-muted-foreground">
                Configure o estoque mínimo para antecipar reposições.
              </p>
            </div>
            <Package className="h-10 w-10 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Clientes fiéis
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">0</p>
              <p className="text-xs text-muted-foreground">
                Fidelize com atendimentos rápidos e transparência.
              </p>
            </div>
            <Users className="h-10 w-10 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Próximos passos sugeridos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-md border border-dashed p-4">
            <p className="text-sm font-semibold text-slate-900">
              Configure o catálogo de produtos
            </p>
            <p className="text-sm text-muted-foreground">
              Cadastre itens com código, estoque mínimo e categoria para agilizar vendas.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/produtos">Ir para produtos</Link>
            </Button>
          </div>
          <div className="space-y-2 rounded-md border border-dashed p-4">
            <p className="text-sm font-semibold text-slate-900">
              Centralize dados dos clientes
            </p>
            <p className="text-sm text-muted-foreground">
              Registre motos, contatos e histórico financeiro para fortalecer relacionamentos.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/clientes">Ir para clientes</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;