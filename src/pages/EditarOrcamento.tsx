import { NovoOrcamentoForm } from "@/components/orcamentos/NovoOrcamentoForm";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const EditarOrcamento = () => {
  const { id } = useParams<{ id: string }>();

  const { data: orcamento, isLoading } = useQuery({
    queryKey: ["orcamento", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("orcamentos")
        .select("*, itens_orcamento(*)")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <NovoOrcamentoForm orcamentoInicial={orcamento} />;
};

export default EditarOrcamento;