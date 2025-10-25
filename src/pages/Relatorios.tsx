import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

const Relatorios = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Relatórios</h1>
        <p className="text-sm text-muted-foreground">
          Analise o desempenho da sua oficina e identifique oportunidades de crescimento.
        </p>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Visão geral</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>
        <TabsContent value="geral">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Resumo geral
                </CardTitle>
                <CardDescription>
                  Faturamento, lucratividade e comparativos por período.
                </CardDescription>
              </div>
              <TrendingUp className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Em breve: gráficos de linha e KPI&apos;s personalizáveis.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="produtos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Produtos mais vendidos
                </CardTitle>
                <CardDescription>
                  Descubra os itens que geram mais receita e ajuste seu estoque.
                </CardDescription>
              </div>
              <BarChart3 className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Em breve: ranking de venda, margem por categoria e sazonalidade.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clientes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Fidelização de clientes
                </CardTitle>
                <CardDescription>
                  Avalie quem mais compra, ticket médio e histórico de serviços.
                </CardDescription>
              </div>
              <PieChart className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Em breve: cohort de clientes, alertas de inatividade e exportação completa.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;