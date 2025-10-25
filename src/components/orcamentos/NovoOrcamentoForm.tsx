import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { showError, showLoading, showSuccess } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { Receipt, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdicionarItemForm } from "../vendas/AdicionarItemForm";
import { ClienteSelector } from "../vendas/ClienteSelector";
import { ItensOrcamentoTable } from "./ItensOrcamentoTable";
import { useOficinaId } from "@/hooks/useOficinaId";

export interface ItemOrcamento {
  id: string;
  tipo: "produto" | "servico";
  produto_id?: string;
  nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

export const NovoOrcamentoForm = () => {
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [numeroOrcamento, setNumeroOrcamento] = useState("");
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: oficinaId, isLoading: isLoadingOficinaId } = useOficinaId();

  useEffect(() => {
    setNumeroOrcamento(`ORC-${Date.now().toString().slice(-6)}`);
  }, []);

  const total = useMemo(
    () => itens.reduce((acc, item) => acc + item.valor_total, 0),
    [itens],
  );

  const handleAddItem = (item: Omit<ItemOrcamento, "id">) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setItens((prev) => [...prev, newItem]);
    showSuccess("Item adicionado com sucesso!");
  };

  const handleUpdateItem = (itemId: string, updates: Partial<ItemOrcamento>) => {
    setItens((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...updates };
          if (updates.quantidade || updates.valor_unitario) {
            updatedItem.valor_total =
              updatedItem.quantidade * updatedItem.valor_unitario;
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setItens((prev) => prev.filter((item) => item.id !== itemId));
  };

  const limparFormulario = () => {
    setClienteId(null);
    setItens([]);
    setNumeroOrcamento(`ORC-${Date.now().toString().slice(-6)}`);
    queryClient.invalidateQueries({ queryKey: ["clientes"] });
  };

  const handleSalvarOrcamento = async () => {
    if (!clienteId) {
      showError("Selecione um cliente para salvar o orçamento.");
      return;
    }
    if (itens.length === 0) {
      showError("Adicione pelo menos um item ao orçamento.");
      return;
    }
    if (!oficinaId) {
      showError("ID da oficina não encontrado. Não é possível salvar.");
      return;
    }

    const toastId = showLoading("Salvando orçamento...");

    const { data: orcamentoData, error: orcamentoError } = await supabase
      .from("orcamentos")
      .insert({
        cliente_id: clienteId,
        numero: numeroOrcamento,
        valor_total: total,
        status: "pendente",
        oficina_id: oficinaId,
      })
      .select("id")
      .single();

    if (orcamentoError || !orcamentoData) {
      showError(`Erro ao criar orçamento: ${orcamentoError?.message}`);
      return;
    }

    const itensParaInserir = itens.map((item) => ({
      orcamento_id: orcamentoData.id,
      tipo: item.tipo,
      produto_id: item.produto_id,
      nome: item.nome,
      quantidade: item.quantidade,
      valor_unitario: item.valor_unitario,
      valor_total: item.valor_total,
    }));

    const { error: itensError } = await supabase
      .from("itens_orcamento")
      .insert(itensParaInserir);

    if (itensError) {
      showError(`Erro ao salvar itens: ${itensError.message}`);
      return;
    }

    showSuccess("Orçamento salvo com sucesso!");
    queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
    navigate("/orcamentos");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo Orçamento</CardTitle>
          <div className="flex flex-col justify-between gap-2 text-sm text-muted-foreground md:flex-row">
            <ClienteSelector
              selectedClienteId={clienteId}
              onSelectCliente={setClienteId}
            />
            <p>
              Orçamento: <span className="font-mono">{numeroOrcamento}</span>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <AdicionarItemForm onAddItem={handleAddItem} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itens do Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <ItensOrcamentoTable
            itens={itens}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-4">
          <div className="text-right">
            <p className="text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
          <div className="flex w-full flex-wrap justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={limparFormulario}
            >
              <Trash2 className="h-4 w-4" /> Limpar
            </Button>
            <Button
              className="gap-2"
              onClick={handleSalvarOrcamento}
              disabled={isLoadingOficinaId}
            >
              <Save className="h-4 w-4" />
              Salvar Orçamento
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};