import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { ReceitasTable } from "./ReceitasTable";
import { ReceitaDialog } from "./ReceitaDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GerenciadorCategorias } from "../configuracoes/GerenciadorCategorias";

export const ReceitasTab = () => {
  const [receitaDialogOpen, setReceitaDialogOpen] = useState(false);
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false);
  const [selectedReceitaId, setSelectedReceitaId] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) => {
    setSelectedReceitaId(id);
    setReceitaDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedReceitaId(null);
    setReceitaDialogOpen(true);
  };

  const handleDialogClose = () => {
    setReceitaDialogOpen(false);
    setSelectedReceitaId(null);
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
          Nova Receita
        </Button>
      </div>
      <ReceitasTable onEdit={handleEdit} />
      <ReceitaDialog
        open={receitaDialogOpen}
        onOpenChange={setReceitaDialogOpen}
        receitaId={selectedReceitaId}
        onFinished={handleDialogClose}
      />
      <Dialog open={categoriaDialogOpen} onOpenChange={setCategoriaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Categorias de Receita</DialogTitle>
            <DialogDescription>
              Adicione, edite ou remova categorias para organizar suas receitas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <GerenciadorCategorias
              tableName="categorias_receita"
              queryKey="categorias_receita"
              title="Categorias de Receita"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};