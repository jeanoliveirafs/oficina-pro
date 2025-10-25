import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProdutoForm } from "./ProdutoForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface ProdutoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produtoId: string | null;
  onFinished: () => void;
}

export const ProdutoDialog = ({
  open,
  onOpenChange,
  produtoId,
  onFinished,
}: ProdutoDialogProps) => {
  const isEditMode = !!produtoId;

  const { data: produto, isLoading } = useQuery({
    queryKey: ["produto", produtoId],
    queryFn: async () => {
      if (!produtoId) return null;
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("id", produtoId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: isEditMode,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize as informações do produto."
              : "Preencha os dados para cadastrar um novo produto."}
          </DialogDescription>
        </DialogHeader>
        {isEditMode && isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <ProdutoForm produtoInicial={produto} onFinished={onFinished} />
        )}
      </DialogContent>
    </Dialog>
  );
};