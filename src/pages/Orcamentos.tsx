import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, FilePlus, Send } from "lucide-react";

const Orcamentos = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">
            Monte orçamentos detalhados, defina validade e converta em vendas com um clique.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2">
            <FilePlus className="h-4 w-4" />
            Novo orçamento
          </Button>
          <Button variant="outline" className="gap-2">
            <Send className="h-4 w-4" />
            Enviar por WhatsApp
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Controle de validade
          </CardTitle>
          <CardDescription>
            Acompanhe orçamentos próximos do vencimento e negocie com o cliente no momento certo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3 rounded-md border border-dashed bg-slate-50 p-4 text-sm text-muted-foreground">
          <Clock className="h-5 w-5 text-primary" />
          Configure alertas automáticos para ser avisado sobre orçamentos prestes a expirar.
        </CardContent>
      </Card>
    </div>
  );
};

export default Orcamentos;