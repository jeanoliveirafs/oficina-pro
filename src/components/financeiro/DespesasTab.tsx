import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { DespesasTable } from "./DespesasTable";
import { DespesaDialog } from "./DespesaDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GerenciadorCategorias } from "../configuracoes/GerenciadorCategorias";

export const DespesasTab = () => {
  const [despesaDialogOpen, setDespesaDialogOpen] = useState(false);
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false);
  const [selectedDespesaId, setSelectedDespesaId] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) => {
    setSelectedDespesaId(id);
    setDespesaDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedDespesaId(null);
    setDespesaDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDespesaDialogOpen(false);
    setSelectedDespesaId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setCategoriaDialogOpen(true)}
        >
          <Settings className="h-4 w-4" />
          Gerenciar Categorias
        </Button>
        <Button className="gap-2" onClick={handleAddNew}>
          <PlusCircle className="h-4 w-4" />
          Nova Despesa
        </Button>
      </div>
      <DespesasTable onEdit={handleEdit} />
      <DespesaDialog
        open={despesaDialogOpen}
        onOpenChange={setDespesaDialogOpen}
        despesaId={selectedDespesaId}
        onFinished={handleDialogClose}
      />
      <Dialog open={categoriaDialogOpen} onOpenChange={setCategoriaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Categorias de Despesa</DialogTitle>
            <DialogDescription>
              Adicione, edite ou remova categorias para organizar suas despesas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <GerenciadorCategorias
              tableName="categorias_despesa"
              queryKey="categorias_despesa"
              title="Categorias de Despesa"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};