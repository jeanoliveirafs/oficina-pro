import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, UserPlus } from "lucide-react";

const Clientes = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre motocicletas, acompanhe saldo em aberto e organize movimentações.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Novo cliente
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Gerar PDF histórico
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Busque e encontre rapidamente
          </CardTitle>
          <CardDescription>
            Localize clientes por nome, modelo da moto ou telefone em poucos segundos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <Input placeholder="Nome, moto ou WhatsApp..." className="flex-1" />
          <Button variant="outline">Filtrar por situação</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;