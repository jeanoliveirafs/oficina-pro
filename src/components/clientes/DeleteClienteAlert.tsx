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

interface DeleteClienteAlertProps {
  cliente: { id: string; nome: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteClienteAlert = ({
  cliente,
  open,
  onOpenChange,
}: DeleteClienteAlertProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!cliente) return;

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", cliente.id);

    if (error) {
      showError(`Erro ao excluir cliente: ${error.message}`);
    } else {
      showSuccess("Cliente excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clientes", "veiculos"] });
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
            cliente <span className="font-bold">{cliente?.nome}</span> e todos
            os seus veículos associados.
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