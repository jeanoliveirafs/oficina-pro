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
    const oficinaId = "a22a15c0-42a6-407a-938b-235595552217"; // ID Fixo

    // Upsert cliente
    const { data: clienteData, error: clienteError } = await supabase
      .from("clientes")
      .upsert({
        id: clienteInicial?.id,
        nome: values.nome,
        telefone: values.telefone,
        oficina_id: oficinaId,
      })
      .select("id")
      .single();

    if (clienteError || !clienteData) {
      showError(`Erro ao salvar cliente: ${clienteError?.message}`);
      return;
    }

    // Upsert veículo
    if (values.marca || values.modelo || values.placa) {
      const { error: veiculoError } = await supabase.from("veiculos").upsert({
        id: veiculoInicial?.id,
        cliente_id: clienteData.id,
        marca: values.marca,
        modelo: values.modelo,
        placa: values.placa,
        oficina_id: oficinaId,
      });

      if (veiculoError) {
        showError(`Erro ao salvar veículo: ${veiculoError.message}`);
        return;
      }
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
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};