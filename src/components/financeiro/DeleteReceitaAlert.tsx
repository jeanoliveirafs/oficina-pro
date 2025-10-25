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

interface DeleteReceitaAlertProps {
  receita: { id: string; descricao: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteReceitaAlert = ({
  receita,
  open,
  onOpenChange,
}: DeleteReceitaAlertProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!receita) return;

    const { error } = await supabase.from("receitas").delete().eq("id", receita.id);

    if (error) {
      showError(`Erro ao excluir receita: ${error.message}`);
    } else {
      showSuccess("Receita excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["receitas"] });
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
            receita <span className="font-bold">{receita?.descricao}</span>.
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