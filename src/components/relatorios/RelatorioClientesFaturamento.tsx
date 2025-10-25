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

interface ClienteFaturamento {
  cliente_id: string;
  nome: string;
  telefone: string;
  total_gasto: number;
  total_vendas: number;
}

const fetchRelatorioClientes = async () => {
  const { data, error } = await supabase.functions.invoke("relatorio-clientes-faturamento");

  if (error) {
    throw new Error(`Erro ao buscar relatório: ${error.message}`);
  }
  return data as ClienteFaturamento[];
};

export const RelatorioClientesFaturamento = () => {
  const { data: clientes, isLoading, error } = useQuery({
    queryKey: ["relatorio_clientes_faturamento"],
    queryFn: fetchRelatorioClientes,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes com Maior Faturamento</CardTitle>
        <CardDescription>
          Ranking de clientes por valor total gasto na oficina.
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
                <TableHead>Cliente</TableHead>
                <TableHead className="w-[150px]">Telefone</TableHead>
                <TableHead className="w-[150px] text-right">Nº de Vendas</TableHead>
                <TableHead className="w-[150px] text-right">Total Gasto</TableHead>
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
                : clientes && clientes.length > 0
                  ? clientes.map((cliente) => (
                      <TableRow key={cliente.cliente_id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell>{cliente.telefone ?? "N/A"}</TableCell>
                        <TableCell className="text-right">{cliente.total_vendas}</TableCell>
                        <TableCell className="text-right">
                          {cliente.total_gasto.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhum dado de faturamento de cliente encontrado.
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