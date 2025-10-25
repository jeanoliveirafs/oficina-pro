import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ProdutoVendido {
  produto_id: string;
  nome: string;
  codigo: string;
  total_vendido: number;
  faturamento_total: number;
}

const fetchRelatorioProdutos = async () => {
  const { data, error } = await supabase.functions.invoke("relatorio-produtos-vendidos");

  if (error) {
    throw new Error(`Erro ao buscar relatório: ${error.message}`);
  }
  return data as ProdutoVendido[];
};

export const RelatorioProdutosVendidos = () => {
  const { data: produtos, isLoading, error } = useQuery({
    queryKey: ["relatorio_produtos_vendidos"],
    queryFn: fetchRelatorioProdutos,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Mais Vendidos</CardTitle>
        <CardDescription>
          Ranking de produtos por quantidade vendida e faturamento gerado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p>{error.message}</p>
          </div>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="w-[120px]">Código</TableHead>
                <TableHead className="w-[150px] text-right">Qtd. Vendida</TableHead>
                <TableHead className="w-[150px] text-right">Faturamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : produtos && produtos.length > 0
                  ? produtos.map((produto) => (
                      <TableRow key={produto.produto_id}>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell className="font-mono">{produto.codigo}</TableCell>
                        <TableCell className="text-right">{produto.total_vendido}</TableCell>
                        <TableCell className="text-right">
                          {produto.faturamento_total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhum dado de venda de produto encontrado.
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};