import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ReceitasTable } from "./ReceitasTable";
import { ReceitaDialog } from "./ReceitaDialog";

export const ReceitasTab = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReceitaId, setSelectedReceitaId] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) => {
    setSelectedReceitaId(id);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedReceitaId(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedReceitaId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleAddNew}>
          <PlusCircle className="h-4 w-4" />
          Nova Receita
        </Button>
      </div>
      <ReceitasTable onEdit={handleEdit} />
      <ReceitaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        receitaId={selectedReceitaId}
        onFinished={handleDialogClose}
      />
    </div>
  );
};