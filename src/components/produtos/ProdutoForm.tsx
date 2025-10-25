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
import { Textarea } from "@/components/ui/textarea";
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

const produtoSchema = z.object({
  codigo: z.string().min(1, "O código é obrigatório."),
  nome: z.string().min(1, "O nome é obrigatório."),
  descricao: z.string().optional(),
  preco_custo: z.coerce.number().min(0, "O preço de custo deve ser positivo."),
  preco_venda: z.coerce.number().min(0, "O preço de venda deve ser positivo."),
  estoque_atual: z.coerce.number().int("O estoque deve ser um número inteiro."),
  categoria_id: z.string().nullable(),
});

type ProdutoFormValues = z.infer<typeof produtoSchema>;

interface Categoria {
  id: string;
  nome: string;
}

interface ProdutoFormProps {
  produtoInicial?: any;
  onFinished: () => void;
}

export const ProdutoForm = ({
  produtoInicial,
  onFinished,
}: ProdutoFormProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!produtoInicial;
  const { data: oficinaId, isLoading: isLoadingOficinaId } = useOficinaId();

  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      codigo: produtoInicial?.codigo ?? "",
      nome: produtoInicial?.nome ?? "",
      descricao: produtoInicial?.descricao ?? "",
      preco_custo: produtoInicial?.preco_custo ?? 0,
      preco_venda: produtoInicial?.preco_venda ?? 0,
      estoque_atual: produtoInicial?.estoque_atual ?? 0,
      categoria_id: produtoInicial?.categoria_id ?? null,
    },
  });

  const { data: categorias, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ["categorias_produto"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categorias_produto")
        .select("id, nome")
        .order("nome");
      if (error) throw new Error(error.message);
      return data as Categoria[];
    },
  });

  const onSubmit = async (values: ProdutoFormValues) => {
    if (!oficinaId) {
      showError("ID da oficina não encontrado. Não é possível salvar.");
      return;
    }

    const dataToUpsert = {
      ...values,
      oficina_id: oficinaId,
    };

    let error;
    if (isEditMode) {
      const { error: updateError } = await supabase
        .from("produtos")
        .update(dataToUpsert)
        .eq("id", produtoInicial.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("produtos")
        .insert(dataToUpsert);
      error = insertError;
    }

    if (error) {
      showError(`Erro ao salvar produto: ${error.message}`);
    } else {
      showSuccess(
        `Produto ${isEditMode ? "atualizado" : "criado"} com sucesso!`,
      );
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      onFinished();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: P001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Óleo de Motor 15W40" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                    <SelectValue placeholder="Selecione uma categoria" />
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="preco_custo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Custo (R$)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preco_venda"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Venda (R$)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estoque_atual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque Atual</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes sobre o produto..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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