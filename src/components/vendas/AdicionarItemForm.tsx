import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Package, Wrench } from "lucide-react";
import { useState } from "react";
import type { ItemVenda } from "./NovaVendaForm";

interface Produto {
  id: string;
  nome: string;
  preco_venda: number;
}

interface AdicionarItemFormProps {
  onAddItem: (item: Omit<ItemVenda, "id">) => void;
}

export const AdicionarItemForm = ({ onAddItem }: AdicionarItemFormProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [precoVenda, setPrecoVenda] = useState(0);

  const [servicoDesc, setServicoDesc] = useState("");
  const [servicoValor, setServicoValor] = useState(0);

  const { data: produtos, isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select("id, nome, preco_venda")
        .order("nome");
      if (error) throw new Error(error.message);
      return data as Produto[];
    },
  });

  const handleSelectProduto = (produto: Produto) => {
    setSelectedProduto(produto);
    setPrecoVenda(produto.preco_venda);
    setPopoverOpen(false);
  };

  const handleAddProduto = () => {
    if (!selectedProduto) return;
    onAddItem({
      tipo: "produto",
      produto_id: selectedProduto.id,
      nome: selectedProduto.nome,
      quantidade,
      valor_unitario: precoVenda,
      valor_total: quantidade * precoVenda,
    });
    setSelectedProduto(null);
    setQuantidade(1);
    setPrecoVenda(0);
  };

  const handleAddServico = () => {
    if (!servicoDesc || !servicoValor) return;
    onAddItem({
      tipo: "servico",
      nome: servicoDesc,
      quantidade: 1,
      valor_unitario: servicoValor,
      valor_total: servicoValor,
    });
    setServicoDesc("");
    setServicoValor(0);
  };

  return (
    <Tabs defaultValue="produto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="produto">
          <Package className="mr-2 h-4 w-4" /> Produto
        </TabsTrigger>
        <TabsTrigger value="servico">
          <Wrench className="mr-2 h-4 w-4" /> Serviço
        </TabsTrigger>
      </TabsList>
      <TabsContent value="produto" className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="space-y-2 sm:col-span-6">
            <Label>Produto</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal"
                  disabled={isLoading}
                >
                  {selectedProduto?.nome ?? "Buscar produto..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Buscar por nome ou código..." />
                  <CommandList>
                    <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                    <CommandGroup>
                      {produtos?.map((p) => (
                        <CommandItem
                          key={p.id}
                          value={p.nome}
                          onSelect={() => handleSelectProduto(p)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProduto?.id === p.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {p.nome}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="qtd">Qtd.</Label>
            <Input
              id="qtd"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input
              id="preco"
              type="number"
              value={precoVenda}
              onChange={(e) => setPrecoVenda(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end sm:col-span-2">
            <Button className="w-full" onClick={handleAddProduto}>
              Adicionar
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="servico" className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="space-y-2 sm:col-span-7">
            <Label htmlFor="serv-desc">Descrição</Label>
            <Input
              id="serv-desc"
              placeholder="Ex: Mão de obra, troca de óleo"
              value={servicoDesc}
              onChange={(e) => setServicoDesc(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-3">
            <Label htmlFor="serv-valor">Valor (R$)</Label>
            <Input
              id="serv-valor"
              type="number"
              value={servicoValor}
              onChange={(e) => setServicoValor(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end sm:col-span-2">
            <Button className="w-full" onClick={handleAddServico}>
              Adicionar
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};