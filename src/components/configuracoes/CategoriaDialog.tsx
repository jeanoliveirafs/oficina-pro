import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriaForm } from "./CategoriaForm";

interface CategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriaId: string | null;
  onFinished: () => void;
  tableName: "categorias_receita" | "categorias_despesa" | "categorias_produto";
  queryKey: string;
}

export const CategoriaDialog = ({
  open,
  onOpenChange,
  categoriaId,
  onFinished,
  tableName,
  queryKey,
}: CategoriaDialogProps) => {
  const isEditMode = !!categoriaId;

  const { data: categoria, isLoading } = useQuery({
    queryKey: [queryKey, categoriaId],
    queryFn: async () => {
      if (!categoriaId) return null;
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", categoriaId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: isEditMode,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        {isEditMode && isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <CategoriaForm
            categoriaInicial={categoria}
            onFinished={onFinished}
            tableName={tableName}
            queryKey={queryKey}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};