import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
import { useState } from "react";

interface Cliente {
  id: string;
  nome: string;
}

interface ClienteSelectorProps {
  selectedClienteId: string | null;
  onSelectCliente: (id: string | null) => void;
}

export const ClienteSelector = ({
  selectedClienteId,
  onSelectCliente,
}: ClienteSelectorProps) => {
  const [open, setOpen] = useState(false);

  const { data: clientes, isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("id, nome")
        .order("nome");
      if (error) throw new Error(error.message);
      return data as Cliente[];
    },
  });

  const selectedCliente = clientes?.find(
    (cliente) => cliente.id === selectedClienteId,
  );

  return (
    <div className="flex w-full items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full flex-1 justify-between md:w-[250px]"
            disabled={isLoading}
          >
            {selectedCliente
              ? selectedCliente.nome
              : "Selecione um cliente..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar cliente..." />
            <CommandList>
              <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
              <CommandGroup>
                {clientes?.map((cliente) => (
                  <CommandItem
                    key={cliente.id}
                    value={cliente.nome}
                    onSelect={() => {
                      onSelectCliente(cliente.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedClienteId === cliente.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {cliente.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="icon" disabled>
        <UserPlus className="h-4 w-4" />
      </Button>
    </div>
  );
};