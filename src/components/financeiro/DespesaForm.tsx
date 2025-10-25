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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/utils/toast";
import { useOficinaId } from "@/hooks/useOficinaId";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

const despesaSchema = z.object({
  descricao: z.string().min(1, "A descrição é obrigatória."),
  valor: z.coerce.number().positive("O valor deve ser positivo."),
  data: z.date({ required_error: "A data é obrigatória." }),
  categoria_id: z.string().nullable(),
  status: z.string().min(1, "O status é obrigatório."),
});

type DespesaFormValues = z.infer<typeof despesaSchema>;

interface Categoria {
  id: string;
  nome: string;
}

interface DespesaFormProps {
  despesaInicial?: any;
  onFinished: () => void;
}

export const DespesaForm = ({ despesaInicial, onFinished }: DespesaFormProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!despesaInicial;
  const { data: oficinaId, isLoading: isLoadingOficinaId } = useOficinaId();

  const form = useForm<DespesaFormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      descricao: despesaInicial?.descricao ?? "",
      valor: despesaInicial?.valor ?? 0,
      data: despesaInicial?.data ? new Date(despesaInicial.data) : new Date(),
      categoria_id: despesaInicial?.categoria_id ?? null,
      status: despesaInicial?.status ?? "pago",
    },
  });

  const { data: categorias, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ["categorias_despesa"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categorias_despesa")
        .select("id, nome")
        .order("nome");
      if (error) throw new Error(error.message);
      return data as Categoria[];
    },
  });

  const onSubmit = async (values: DespesaFormValues) => {
    if (!oficinaId) {
      showError("ID da oficina não encontrado.");
      return;
    }

    const dataToUpsert = { ...values, oficina_id: oficinaId };
    let error;

    if (isEditMode) {
      const { error: updateError } = await supabase
        .from("despesas")
        .update(dataToUpsert)
        .eq("id", despesaInicial.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("despesas")
        .insert(dataToUpsert);
      error = insertError;
    }

    if (error) {
      showError(`Erro ao salvar despesa: ${error.message}`);
    } else {
      showSuccess("Despesa salva com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["despesas"] });
      queryClient.invalidateQueries({ queryKey: ["contas_pagar"] });
      queryClient.invalidateQueries({ queryKey: ["financeiro_summary"] });
      onFinished();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Aluguel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoria_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                  disabled={isLoadingCategorias}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorias?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
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