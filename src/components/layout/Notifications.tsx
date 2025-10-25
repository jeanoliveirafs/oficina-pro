import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";

interface AlertaEstoque {
  id: string;
  nivel_atual: number;
  nivel_minimo: number;
  produtos: {
    id: string;
    nome: string;
  }
}

const fetchAlertas = async () => {
  const { data, error } = await supabase
    .from("alertas_estoque")
    .select("id, nivel_atual, nivel_minimo, produtos(id, nome)")
    .eq("ativo", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching stock alerts:", error);
    throw new Error(error.message);
  }
  return data as AlertaEstoque[];
}

export const Notifications = () => {
  const { data: alertas, isLoading } = useQuery({
    queryKey: ["alertas_estoque"],
    queryFn: fetchAlertas,
    refetchInterval: 60000, // Recarrega a cada 1 minuto
  });

  const hasAlerts = alertas && alertas.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasAlerts && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {alertas.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Notificações</h4>
          <p className="text-sm text-muted-foreground">
            Alertas importantes sobre sua oficina.
          </p>
        </div>
        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : hasAlerts ? (
            alertas.map((alerta) => (
              <div key={alerta.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">Estoque Baixo</p>
                <p className="text-muted-foreground">
                  O produto <Link to={`/produtos`} className="font-semibold text-primary hover:underline">{alerta.produtos.nome}</Link> está acabando.
                </p>
                <p className="text-xs text-muted-foreground">
                  Estoque: {alerta.nivel_atual}/{alerta.nivel_minimo}
                </p>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação nova.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}