import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteOrcamentoAlert } from "./DeleteOrcamentoAlert";

interface Orcamento {
  id: string;
  numero: string;
  status: string;
  valor_total: number;
  created_at: string;
  cliente_id: string;
  clientes: { nome: string } | null;
}

export const OrcamentosTable = () => {
  const [deletingOrcamento, setDeletingOrcamento] = useState<Orcamento | null>(
    null,
  );
  const navigate = useNavigate();

  const {
    data: orcamentos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orcamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orcamentos")
        .select(
          "id, numero, status, valor_total, created_at, cliente_id, clientes(nome)",
        )
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data as Orcamento[];
    },
  });

  const handleConvertToVenda = (orcamento: Orcamento) => {
    navigate("/vendas", { state: { orcamentoId: orcamento.id } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamentos Recentes</CardTitle>
        <CardDescription>
          Acompanhe os orçamentos pendentes e aprovados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="w-[120px]">Data</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px]">Valor</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : orcamentos?.map((orc) => (
                    <TableRow key={orc.id}>
                      <TableCell className="font-mono">{orc.numero}</TableCell>
                      <TableCell>{orc.clientes?.nome ?? "N/A"}</TableCell>
                      <TableCell>
                        {format(new Date(orc.created_at), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{orc.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {orc.valor_total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/orcamentos/editar/${orc.id}`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleConvertToVenda(orc)}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Converter em Venda
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeletingOrcamento(orc)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <DeleteOrcamentoAlert
        orcamento={deletingOrcamento}
        open={!!deletingOrcamento}
        onOpenChange={(open) => !open && setDeletingOrcamento(null)}
      />
    </Card>
  );
};