import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReceitaForm } from "./ReceitaForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface ReceitaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receitaId: string | null;
  onFinished: () => void;
}

export const ReceitaDialog = ({
  open,
  onOpenChange,
  receitaId,
  onFinished,
}: ReceitaDialogProps) => {
  const isEditMode = !!receitaId;

  const { data: receita, isLoading } = useQuery({
    queryKey: ["receita", receitaId],
    queryFn: async () => {
      if (!receitaId) return null;
      const { data, error } = await supabase
        .from("receitas")
        .select("*")
        .eq("id", receitaId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: isEditMode,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Receita" : "Nova Receita"}</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar uma nova entrada financeira.
          </DialogDescription>
        </DialogHeader>
        {isEditMode && isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <ReceitaForm receitaInicial={receita} onFinished={onFinished} />
        )}
      </DialogContent>
    </Dialog>
  );
};