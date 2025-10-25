import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DespesaForm } from "./DespesaForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface DespesaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  despesaId: string | null;
  onFinished: () => void;
  defaultStatus?: string;
  title?: string;
  description?: string;
}

export const DespesaDialog = ({
  open,
  onOpenChange,
  despesaId,
  onFinished,
  defaultStatus,
  title,
  description,
}: DespesaDialogProps) => {
  const isEditMode = !!despesaId;

  const { data: despesa, isLoading } = useQuery({
    queryKey: ["despesa", despesaId],
    queryFn: async () => {
      if (!despesaId) return null;
      const { data, error } = await supabase
        .from("despesas")
        .select("*")
        .eq("id", despesaId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: isEditMode,
  });

  const dialogTitle = title ?? (isEditMode ? "Editar Despesa" : "Nova Despesa");
  const dialogDescription =
    description ??
    (isEditMode
      ? "Atualize as informações deste lançamento."
      : "Preencha os dados para registrar uma nova saída financeira.");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {isEditMode && isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <DespesaForm
            despesaInicial={despesa}
            onFinished={onFinished}
            defaultStatus={defaultStatus}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};