import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/utils/toast";
import { useOficinaId } from "@/hooks/useOficinaId";

const clienteSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório."),
  telefone: z.string().optional(),
  // Veículo
  marca: z.string().optional(),
  modelo: z.string().optional(),
  placa: z.string().optional(),
});

type ClienteFormValues = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  clienteInicial?: any;
  onFinished: () => void;
}

export const ClienteForm = ({
  clienteInicial,
  onFinished,
}: ClienteFormProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!clienteInicial;
  const veiculoInicial = clienteInicial?.veiculos?.[0];
  const { data: oficinaId, isLoading: isLoadingOficinaId } = useOficinaId();

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: clienteInicial?.nome ?? "",
      telefone: clienteInicial?.telefone ?? "",
      marca: veiculoInicial?.marca ?? "",
      modelo: veiculoInicial?.modelo ?? "",
      placa: veiculoInicial?.placa ?? "",
    },
  });

  const onSubmit = async (values: ClienteFormValues) => {
    if (!oficinaId) {
      showError("ID da oficina não encontrado. Não é possível salvar.");
      return;
    }

    // 1. Salvar dados do cliente
    let clienteId = clienteInicial?.id;
    let clienteError;

    if (isEditMode) {
      const { error } = await supabase
        .from("clientes")
        .update({ nome: values.nome, telefone: values.telefone })
        .eq("id", clienteId);
      clienteError = error;
    } else {
      const { data, error } = await supabase
        .from("clientes")
        .insert({
          nome: values.nome,
          telefone: values.telefone,
          oficina_id: oficinaId,
        })
        .select("id")
        .single();
      if (data) clienteId = data.id;
      clienteError = error;
    }

    if (clienteError || !clienteId) {
      showError(`Erro ao salvar cliente: ${clienteError?.message}`);
      return;
    }

    // 2. Salvar dados do veículo
    const hasVehicleData = values.marca || values.modelo || values.placa;
    let veiculoError;

    if (hasVehicleData) {
      const veiculoPayload = {
        cliente_id: clienteId,
        marca: values.marca,
        modelo: values.modelo,
        placa: values.placa,
        oficina_id: oficinaId,
      };
      if (veiculoInicial?.id) {
        const { error } = await supabase
          .from("veiculos")
          .update(veiculoPayload)
          .eq("id", veiculoInicial.id);
        veiculoError = error;
      } else {
        const { error } = await supabase
          .from("veiculos")
          .insert(veiculoPayload);
        veiculoError = error;
      }
    } else if (veiculoInicial?.id) {
      const { error } = await supabase
        .from("veiculos")
        .delete()
        .eq("id", veiculoInicial.id);
      veiculoError = error;
    }

    if (veiculoError) {
      showError(`Erro ao salvar veículo: ${veiculoError.message}`);
      return;
    }

    showSuccess(
      `Cliente ${isEditMode ? "atualizado" : "criado"} com sucesso!`,
    );
    queryClient.invalidateQueries({ queryKey: ["clientes", "veiculos"] });
    onFinished();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 90000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-md border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Veículo Principal
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Honda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: CB 600F Hornet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="placa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input placeholder="ABC-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onFinished}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoadingOficinaId}>
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
};