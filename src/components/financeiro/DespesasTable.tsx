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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { DeleteDespesaAlert } from "./DeleteDespesaAlert";
import { Badge } from "../ui/badge";

interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  status: string;
  categorias_despesa: { nome: string } | null;
}

interface DespesasTableProps {
  onEdit: (id: string) => void;
}

export const DespesasTable = ({ onEdit }: DespesasTableProps) => {
  const [deletingDespesa, setDeletingDespesa] = useState<Despesa | null>(null);

  const {
    data: despesas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["despesas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("despesas")
        .select("*, categorias_despesa(nome)")
        .order("data", { ascending: false });
      if (error) throw new Error(error.message);
      return data as Despesa[];
    },
  });

  if (error) {
    return <div className="text-red-500">Erro: {error.message}</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Valor</TableHead>
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
            : despesas?.map((despesa) => (
                <TableRow key={despesa.id}>
                  <TableCell className="font-medium">{despesa.descricao}</TableCell>
                  <TableCell>{despesa.categorias_despesa?.nome ?? "N/A"}</TableCell>
                  <TableCell>{format(new Date(despesa.data), "dd/MM/yyyy")}</TableCell>
                  <TableCell><Badge variant="outline">{despesa.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    {despesa.valor.toLocaleString("pt-BR", {
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
                        <DropdownMenuItem onClick={() => onEdit(despesa.id)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletingDespesa(despesa)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <DeleteDespesaAlert
        despesa={deletingDespesa}
        open={!!deletingDespesa}
        onOpenChange={(open) => !open && setDeletingDespesa(null)}
      />
    </div>
  );
};