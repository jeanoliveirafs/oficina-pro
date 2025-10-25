import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { OrcamentosTable } from "@/components/orcamentos/OrcamentosTable";

const Orcamentos = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">
            Crie, gerencie e converta orçamentos em vendas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2" asChild>
            <Link to="/orcamentos/novo">
              <FilePlus className="h-4 w-4" />
              Novo orçamento
            </Link>
          </Button>
        </div>
      </div>

      <OrcamentosTable />
    </div>
  );
};

export default Orcamentos;