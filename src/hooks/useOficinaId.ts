import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const fetchOficinaId = async () => {
  const { data, error } = await supabase
    .from("oficinas")
    .select("id")
    .limit(1)
    .single();

  if (error) {
    console.error("Erro ao buscar ID da oficina:", error);
    throw new Error("Nenhuma oficina encontrada para associar os dados.");
  }
  if (!data) {
    throw new Error("Nenhuma oficina encontrada no banco de dados.");
  }
  return data.id;
};

export const useOficinaId = () => {
  return useQuery({
    queryKey: ["oficina_id"],
    queryFn: fetchOficinaId,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};