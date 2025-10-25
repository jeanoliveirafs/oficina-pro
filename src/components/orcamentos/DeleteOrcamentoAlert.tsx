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

interface DeleteOrcamentoAlertProps {
  orcamento: { id: string; numero: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteOrcamentoAlert = ({
  orcamento,
  open,
  onOpenChange,
}: DeleteOrcamentoAlertProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!orcamento) return;

    // Primeiro, exclui os itens associados
    const { error: itemsError } = await supabase
      .from("itens_orcamento")
      .delete()
      .eq("orcamento_id", orcamento.id);

    if (itemsError) {
      showError(`Erro ao excluir itens do orçamento: ${itemsError.message}`);
      return;
    }

    // Depois, exclui o orçamento
    const { error: orcamentoError } = await supabase
      .from("orcamentos")
      .delete()
      .eq("id", orcamento.id);

    if (orcamentoError) {
      showError(`Erro ao excluir orçamento: ${orcamentoError.message}`);
    } else {
      showSuccess("Orçamento excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            orçamento <span className="font-bold">{orcamento?.numero}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Sim, excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};