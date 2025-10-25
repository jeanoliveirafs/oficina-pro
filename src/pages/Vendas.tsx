import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Receipt, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Vendas = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendas Diretas</h1>
          <p className="text-sm text-muted-foreground">
            Inicie novas vendas, gere orçamentos e acompanhe seu fluxo diário.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="gap-2">
            <Link to="/vendas">
              <PlusCircle className="h-4 w-4" />
              Nova venda
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/orcamentos">
              <Receipt className="h-4 w-4" />
              Gerenciar orçamentos
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Vendas de hoje
            </CardTitle>
            <Wallet className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">R$ 0,00</p>
            <CardDescription>
              Configure a integração de vendas para visualizar seus números.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Orçamentos pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">0</p>
            <CardDescription>
              Converta orçamentos em vendas para aumentar sua receita.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Atalhos rápidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Buscar cliente por WhatsApp</p>
            <p>• Adicionar mão de obra personalizada</p>
            <p>• Registrar venda fiado com controle automático</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vendas;