import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClienteForm } from "./ClienteForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface ClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId: string | null;
  onFinished: () => void;
}

export const ClienteDialog = ({
  open,
  onOpenChange,
  clienteId,
  onFinished,
}: ClienteDialogProps) => {
  const isEditMode = !!clienteId;

  const { data: cliente, isLoading } = useQuery({
    queryKey: ["cliente", clienteId],
    queryFn: async () => {
      if (!clienteId) return null;
      const { data, error } = await supabase
        .from("clientes")
        .select("*, veiculos(*)")
        .eq("id", clienteId)
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
            {isEditMode ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize os dados do cliente e seu veículo principal."
              : "Preencha os dados para cadastrar um novo cliente."}
          </DialogDescription>
        </DialogHeader>
        {isEditMode && isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <ClienteForm clienteInicial={cliente} onFinished={onFinished} />
        )}
      </DialogContent>
    </Dialog>
  );
};