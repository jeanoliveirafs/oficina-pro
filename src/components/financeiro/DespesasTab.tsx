import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DespesasTable } from "./DespesasTable";
import { DespesaDialog } from "./DespesaDialog";

export const DespesasTab = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDespesaId, setSelectedDespesaId] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) => {
    setSelectedDespesaId(id);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedDespesaId(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDespesaId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleAddNew}>
          <PlusCircle className="h-4 w-4" />
          Nova Despesa
        </Button>
      </div>
      <DespesasTable onEdit={handleEdit} />
      <DespesaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        despesaId={selectedDespesaId}
        onFinished={handleDialogClose}
      />
    </div>
  );
};