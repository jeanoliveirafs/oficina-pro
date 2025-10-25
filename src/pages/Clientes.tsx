import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { ClientesTable } from "@/components/clientes/ClientesTable";
import { ClienteDialog } from "@/components/clientes/ClienteDialog";

const Clientes = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) => {
    setSelectedClienteId(id);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedClienteId(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedClienteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus clientes, veículos e histórico financeiro.
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddNew}>
          <UserPlus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      <ClientesTable onEdit={handleEdit} />

      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clienteId={selectedClienteId}
        onFinished={handleDialogClose}
      />
    </div>
  );
};

export default Clientes;