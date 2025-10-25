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

interface DeleteProdutoAlertProps {
  produto: { id: string; nome: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteProdutoAlert = ({
  produto,
  open,
  onOpenChange,
}: DeleteProdutoAlertProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!produto) return;

    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", produto.id);

    if (error) {
      showError(`Erro ao excluir produto: ${error.message}`);
    } else {
      showSuccess("Produto excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
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
            produto <span className="font-bold">{produto?.nome}</span>.
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