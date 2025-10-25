import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PackagePlus } from "lucide-react";
import { ProdutosTable } from "@/components/produtos/ProdutosTable";
import { ProdutoDialog } from "@/components/produtos/ProdutoDialog";

const Produtos = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProdutoId, setSelectedProdutoId] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) => {
    setSelectedProdutoId(id);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProdutoId(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedProdutoId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seu catálogo, controle o estoque e organize por categorias.
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddNew}>
          <PackagePlus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>

      <ProdutosTable onEdit={handleEdit} />

      <ProdutoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        produtoId={selectedProdutoId}
        onFinished={handleDialogClose}
      />
    </div>
  );
};

export default Produtos;