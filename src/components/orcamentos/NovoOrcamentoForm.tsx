import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOficinaId } from "@/hooks/useOficinaId";
import { supabase } from "@/lib/supabaseClient";
import { showError, showLoading, showSuccess } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdicionarItemForm } from "../vendas/AdicionarItemForm";
import { ClienteSelector } from "../vendas/ClienteSelector";
import { ItensOrcamentoTable } from "./ItensOrcamentoTable";

export interface ItemOrcamento {
  id: string;
  tipo: "produto" | "servico";
  produto_id?: string;
  nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

interface NovoOrcamentoFormProps {
  orcamentoInicial?: any;
}

export const NovoOrcamentoForm = ({
  orcamentoInicial,
}: NovoOrcamentoFormProps) => {
  const isEditMode = !!orcamentoInicial;
  const [clienteId, setClienteId] = useState<string | null>(
    orcamentoInicial?.cliente_id ?? null,
  );
  const [numeroOrcamento, setNumeroOrcamento] = useState("");
  const [itens, setItens] = useState<ItemOrcamento[]>(
    orcamentoInicial?.itens_orcamento?.map((item: any) => ({
      ...item,
      id: crypto.randomUUID(),
    })) ?? [],
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: oficinaId, isLoading: isLoadingOficinaId } = useOficinaId();

  useEffect(() => {
    if (isEditMode) {
      setNumeroOrcamento(orcamentoInicial.numero);
    } else {
      setNumeroOrcamento(`ORC-${Date.now().toString().slice(-6)}`);
    }
  }, [isEditMode, orcamentoInicial]);

  const total = useMemo(
    () => itens.reduce((acc, item) => acc + item.valor_total, 0),
    [itens],
  );

  const handleAddItem = (item: Omit<ItemOrcamento, "id">) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setItens((prev) => [...prev, newItem]);
    showSuccess("Item adicionado com sucesso!");
  };

  const handleUpdateItem = (
    itemId: string,
    updates: Partial<ItemOrcamento>,
  ) => {
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
    if (!isEditMode) {
      setNumeroOrcamento(`ORC-${Date.now().toString().slice(-6)}`);
    }
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

    const toastId = showLoading(
      isEditMode ? "Atualizando orçamento..." : "Salvando orçamento...",
    );

    let orcamentoId = orcamentoInicial?.id;
    let orcamentoError;

    if (isEditMode) {
      const { error } = await supabase
        .from("orcamentos")
        .update({
          cliente_id: clienteId,
          valor_total: total,
        })
        .eq("id", orcamentoId);
      orcamentoError = error;
    } else {
      const { data, error } = await supabase
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
      if (data) orcamentoId = data.id;
      orcamentoError = error;
    }

    if (orcamentoError || !orcamentoId) {
      showError(`Erro ao salvar orçamento: ${orcamentoError?.message}`);
      return;
    }

    if (isEditMode) {
      const { error: deleteError } = await supabase
        .from("itens_orcamento")
        .delete()
        .eq("orcamento_id", orcamentoId);
      if (deleteError) {
        showError(`Erro ao atualizar itens: ${deleteError.message}`);
        return;
      }
    }

    if (itens.length > 0) {
      const itensParaInserir = itens.map((item) => ({
        orcamento_id: orcamentoId,
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
    }

    showSuccess(
      `Orçamento ${isEditMode ? "atualizado" : "salvo"} com sucesso!`,
    );
    queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
    navigate("/orcamentos");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Editar Orçamento" : "Novo Orçamento"}
          </CardTitle>
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
              {isEditMode ? "Atualizar Orçamento" : "Salvar Orçamento"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};