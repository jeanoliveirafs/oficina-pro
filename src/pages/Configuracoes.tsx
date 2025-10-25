import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const Configuracoes = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Personalize dados da oficina, equipe, plano e integrações.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Dados da oficina
          </CardTitle>
          <CardDescription>
            Informe nome, CNPJ e contatos para aparecer em relatórios e PDFs.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da oficina</Label>
            <Input id="nome" placeholder="Oficina Mecânica Exemplo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" placeholder="00.000.000/0000-00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">WhatsApp</Label>
            <Input id="telefone" placeholder="(00) 90000-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail comercial</Label>
            <Input id="email" placeholder="contato@oficina.com" />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button className="gap-2">
            <Check className="h-4 w-4" />
            Salvar alterações
          </Button>
          <Button variant="outline">Cancelar</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Configuracoes;