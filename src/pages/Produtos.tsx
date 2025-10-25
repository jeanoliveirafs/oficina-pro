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
import { PackagePlus, Search } from "lucide-react";

const Produtos = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Controle estoque, cadastre categorias e mantenha seus itens sempre atualizados.
          </p>
        </div>
        <Button className="gap-2">
          <PackagePlus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Controle e busca inteligente
          </CardTitle>
          <CardDescription>
            Busque por código, nome ou categoria e mantenha o estoque alinhado com as vendas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 lg:flex-row">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar produtos..." className="w-full" />
          </div>
          <Button variant="outline">Filtrar categorias</Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Em breve: autoatualização de estoque, comparação de preço custo/venda e alertas avançados.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Produtos;