import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOficinaId } from "@/hooks/useOficinaId";
import { supabase } from "@/lib/supabaseClient";
import { showError, showLoading, showSuccess } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { DollarSign, Receipt, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdicionarItemForm } from "./AdicionarItemForm";
import { ClienteSelector } from "./ClienteSelector";
import { ItensVendaTable } from "./ItensVendaTable";

export interface ItemVenda {
  id: string;
  tipo: "produto" | "servico";
  produto_id?: string;
  nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

export const NovaVendaForm = () => {
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [numeroPedido, setNumeroPedido] = useState("");
  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const queryClient = useQueryClient();
  const { data: oficinaId, isLoading: isLoadingOficinaId } = useOficinaId();
  const location = useLocation();
  const navigate = useNavigate();
  const orcamentoId = location.state?.orcamentoId;

  useEffect(() => {
    setNumeroPedido(`VEN-${Date.now().toString().slice(-6)}`);
  }, []);

  useEffect(() => {
    const loadOrcamentoData = async () => {
      if (!orcamentoId) return;

      const toastId = showLoading("Carregando dados do orçamento...");

      const { data: orcamentoData, error: orcamentoError } = await supabase
        .from("orcamentos")
        .select("cliente_id")
        .eq("id", orcamentoId)
        .single();

      if (orcamentoError || !orcamentoData) {
        showError("Erro ao buscar dados do orçamento.");
        return;
      }

      const { data: itensData, error: itensError } = await supabase
        .from("itens_orcamento")
        .select("*")
        .eq("orcamento_id", orcamentoId);

      if (itensError) {
        showError("Erro ao buscar itens do orçamento.");
        return;
      }

      setClienteId(orcamentoData.cliente_id);
      const newItens = itensData.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      }));
      setItens(newItens);

      showSuccess("Orçamento carregado com sucesso!");
      navigate(location.pathname, { replace: true, state: {} });
    };

    loadOrcamentoData();
  }, [orcamentoId, navigate, location.pathname]);

  const total = useMemo(
    () => itens.reduce((acc, item) => acc + item.valor_total, 0),
    [itens],
  );

  const handleAddItem = (item: Omit<ItemVenda, "id">) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setItens((prev) => [...prev, newItem]);
    showSuccess("Item adicionado com sucesso!");
  };

  const handleUpdateItem = (itemId: string, updates: Partial<ItemVenda>) => {
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

  const limparVenda = () => {
    setClienteId(null);
    setItens([]);
    setFormaPagamento("dinheiro");
    setNumeroPedido(`VEN-${Date.now().toString().slice(-6)}`);
    queryClient.invalidateQueries({ queryKey: ["clientes"] });
  };

  const handleFinalizarVenda = async () => {
    if (!clienteId) {
      showError("Selecione um cliente para finalizar a venda.");
      return;
    }
    if (itens.length === 0) {
      showError("Adicione pelo menos um item à venda.");
      return;
    }
    if (!oficinaId) {
      showError("ID da oficina não encontrado. Não é possível salvar.");
      return;
    }

    const toastId = showLoading("Finalizando venda...");

    const { data: vendaData, error: vendaError } = await supabase
      .from("vendas")
      .insert({
        cliente_id: clienteId,
        numero: numeroPedido,
        valor_total: total,
        valor_final: total,
        forma_pagamento: formaPagamento,
        status: "finalizada",
        oficina_id: oficinaId,
        orcamento_id: orcamentoId,
      })
      .select("id")
      .single();

    if (vendaError || !vendaData) {
      showError(`Erro ao criar venda: ${vendaError?.message}`);
      return;
    }

    const itensParaInserir = itens.map((item) => ({
      venda_id: vendaData.id,
      tipo: item.tipo,
      produto_id: item.produto_id,
      nome: item.nome,
      quantidade: item.quantidade,
      preco_unitario: item.valor_unitario,
      preco_total: item.valor_total,
    }));

    const { error: itensError } = await supabase
      .from("itens_venda")
      .insert(itensParaInserir);

    if (itensError) {
      showError(`Erro ao salvar itens: ${itensError.message}`);
      return;
    }

    if (orcamentoId) {
      await supabase
        .from("orcamentos")
        .update({ status: "aprovado" })
        .eq("id", orcamentoId);
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
    }

    showSuccess("Venda finalizada com sucesso!");
    limparVenda();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Venda</CardTitle>
          <div className="flex flex-col justify-between gap-2 text-sm text-muted-foreground md:flex-row">
            <ClienteSelector
              selectedClienteId={clienteId}
              onSelectCliente={setClienteId}
            />
            <p>
              Pedido: <span className="font-mono">{numeroPedido}</span>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <AdicionarItemForm onAddItem={handleAddItem} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itens Adicionados</CardTitle>
          <CardDescription>
            Revise, edite a quantidade ou remova itens antes de finalizar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItensVendaTable
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
          <div className="flex w-full flex-col items-center justify-between gap-3 border-t pt-4 md:flex-row">
            <div className="flex w-full items-center gap-2 md:w-auto">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Forma de Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="debito">Cartão de Débito</SelectItem>
                  <SelectItem value="fiado">Fiado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={limparVenda}
              >
                <Trash2 className="h-4 w-4" /> Limpar
              </Button>
              <Button variant="secondary" className="gap-2" disabled>
                <Receipt className="h-4 w-4" /> Salvar Orçamento
              </Button>
              <Button
                className="gap-2"
                onClick={handleFinalizarVenda}
                disabled={isLoadingOficinaId}
              >
                Finalizar Venda
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};