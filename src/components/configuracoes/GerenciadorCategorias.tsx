import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriaDialog } from "./CategoriaDialog";
import { DeleteCategoriaAlert } from "./DeleteCategoriaAlert";

interface Categoria {
  id: string;
  nome: string;
}

interface GerenciadorCategoriasProps {
  tableName: "categorias_receita" | "categorias_despesa" | "categorias_produto";
  queryKey: string;
  title: string;
}

export const GerenciadorCategorias = ({
  tableName,
  queryKey,
  title,
}: GerenciadorCategoriasProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingCategoria, setDeletingCategoria] = useState<Categoria | null>(
    null,
  );
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(
    null,
  );

  const {
    data: categorias,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select("id, nome")
        .order("nome");
      if (error) throw new Error(error.message);
      return data as Categoria[];
    },
  });

  const handleEdit = (id: string) => {
    setSelectedCategoriaId(id);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCategoriaId(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCategoriaId(null);
  };

  if (error) {
    return <div className="text-red-500">Erro: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <Button size="sm" className="gap-2" onClick={handleAddNew}>
          <PlusCircle className="h-4 w-4" />
          Adicionar
        </Button>
      </div>
      <div className="space-y-2 rounded-md border p-2">
        {isLoading
          ? <Skeleton className="h-8 w-full" />
          : categorias && categorias.length > 0
            ? categorias.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
                >
                  <p className="text-sm">{cat.nome}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(cat.id)}>
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeletingCategoria(cat)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            : (
              <p className="p-2 text-center text-sm text-muted-foreground">
                Nenhuma categoria cadastrada.
              </p>
            )}
      </div>
      <CategoriaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categoriaId={selectedCategoriaId}
        onFinished={handleDialogClose}
        tableName={tableName}
        queryKey={queryKey}
      />
      <DeleteCategoriaAlert
        categoria={deletingCategoria}
        open={!!deletingCategoria}
        onOpenChange={(open) => !open && setDeletingCategoria(null)}
        tableName={tableName}
        queryKey={queryKey}
      />
    </div>
  );
};