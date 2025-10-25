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

interface DeleteCategoriaAlertProps {
  categoria: { id: string; nome: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableName: "categorias_receita" | "categorias_despesa";
  queryKey: string;
}

export const DeleteCategoriaAlert = ({
  categoria,
  open,
  onOpenChange,
  tableName,
  queryKey,
}: DeleteCategoriaAlertProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!categoria) return;

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", categoria.id);

    if (error) {
      showError(`Erro ao excluir categoria: ${error.message}`);
    } else {
      showSuccess("Categoria excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
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
            categoria <span className="font-bold">{categoria?.nome}</span>.
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