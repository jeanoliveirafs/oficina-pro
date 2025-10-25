import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteDespesaAlertProps {
  despesa: { id: string; descricao: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteDespesaAlert = ({
  despesa,
  open,
  onOpenChange,
}: DeleteDespesaAlertProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!despesa) return;

    const { error } = await supabase.from("despesas").delete().eq("id", despesa.id);

    if (error) {
      showError(`Erro ao excluir despesa: ${error.message}`);
    } else {
      showSuccess("Despesa excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["despesas"] });
      queryClient.invalidateQueries({ queryKey: ["contas_pagar"] });
      queryClient.invalidateQueries({ queryKey: ["financeiro_summary"] });
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a
            despesa <span className="font-bold">{despesa?.descricao}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Sim, excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};