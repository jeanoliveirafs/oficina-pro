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
import { DeleteReceitaAlert } from "./DeleteReceitaAlert";
import { Badge } from "../ui/badge";

interface Receita {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  status: string;
  categorias_receita: { nome: string } | null;
}

interface ReceitasTableProps {
  onEdit: (id: string) => void;
}

export const ReceitasTable = ({ onEdit }: ReceitasTableProps) => {
  const [deletingReceita, setDeletingReceita] = useState<Receita | null>(null);

  const {
    data: receitas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["receitas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receitas")
        .select("*, categorias_receita(nome)")
        .order("data", { ascending: false });
      if (error) throw new Error(error.message);
      return data as Receita[];
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
            : receitas?.map((receita) => (
                <TableRow key={receita.id}>
                  <TableCell className="font-medium">{receita.descricao}</TableCell>
                  <TableCell>{receita.categorias_receita?.nome ?? "N/A"}</TableCell>
                  <TableCell>{format(new Date(receita.data), "dd/MM/yyyy")}</TableCell>
                  <TableCell><Badge variant="outline">{receita.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    {receita.valor.toLocaleString("pt-BR", {
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
                        <DropdownMenuItem onClick={() => onEdit(receita.id)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletingReceita(receita)}
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
      <DeleteReceitaAlert
        receita={deletingReceita}
        open={!!deletingReceita}
        onOpenChange={(open) => !open && setDeletingReceita(null)}
      />
    </div>
  );
};