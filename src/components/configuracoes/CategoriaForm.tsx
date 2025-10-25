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

const categoriaSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório."),
});

type CategoriaFormValues = z.infer<typeof categoriaSchema>;

interface CategoriaFormProps {
  categoriaInicial?: any;
  onFinished: () => void;
  tableName: "categorias_receita" | "categorias_despesa" | "categorias_produto";
  queryKey: string;
}

export const CategoriaForm = ({
  categoriaInicial,
  onFinished,
  tableName,
  queryKey,
}: CategoriaFormProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!categoriaInicial;
  const { data: oficinaId, isLoading: isLoadingOficinaId } = useOficinaId();

  const form = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nome: categoriaInicial?.nome ?? "",
    },
  });

  const onSubmit = async (values: CategoriaFormValues) => {
    if (!oficinaId) {
      showError("ID da oficina não encontrado.");
      return;
    }

    const dataToUpsert = { ...values, oficina_id: oficinaId };
    let error;

    if (isEditMode) {
      const { error: updateError } = await supabase
        .from(tableName)
        .update(dataToUpsert)
        .eq("id", categoriaInicial.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(dataToUpsert);
      error = insertError;
    }

    if (error) {
      showError(`Erro ao salvar categoria: ${error.message}`);
    } else {
      showSuccess("Categoria salva com sucesso!");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      onFinished();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Categoria</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Venda de Peças" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
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