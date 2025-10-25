import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { CheckCircle } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";

interface Conta {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  status: string;
  categorias_despesa: { nome: string } | null;
}

export const ContasPagarTab = () => {
  const queryClient = useQueryClient();
  const {
    data: contas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contas_pagar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("despesas")
        .select("*, categorias_despesa(nome)")
        .in("status", ["pendente", "atrasado"])
        .order("data", { ascending: true });
      if (error) throw new Error(error.message);
      return data as Conta[];
    },
  });

  const handleMarkAsPaid = async (id: string) => {
    const { error } = await supabase
      .from("despesas")
      .update({ status: "pago" })
      .eq("id", id);

    if (error) {
      showError("Erro ao atualizar conta.");
    } else {
      showSuccess("Conta marcada como paga!");
      queryClient.invalidateQueries({ queryKey: ["contas_pagar"] });
      queryClient.invalidateQueries({ queryKey: ["despesas"] });
      queryClient.invalidateQueries({ queryKey: ["financeiro_summary"] });
    }
  };

  if (error) {
    return <div className="text-red-500">Erro: {error.message}</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : contas && contas.length > 0
              ? contas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell className="font-medium">{conta.descricao}</TableCell>
                    <TableCell>{format(new Date(conta.data), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={conta.status === "atrasado" ? "destructive" : "secondary"}
                      >
                        {conta.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {conta.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleMarkAsPaid(conta.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Marcar como Pago
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhuma conta pendente.
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  );
};