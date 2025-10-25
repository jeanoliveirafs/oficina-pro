import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DeleteProdutoAlert } from "./DeleteProdutoAlert";
import { Skeleton } from "@/components/ui/skeleton";

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  estoque_atual: number;
  preco_venda: number;
  categorias_produto: { nome: string } | null;
}

interface ProdutosTableProps {
  onEdit: (id: string) => void;
}

export const ProdutosTable = ({ onEdit }: ProdutosTableProps) => {
  const [deletingProduto, setDeletingProduto] = useState<Produto | null>(null);

  const {
    data: produtos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select(
          "id, codigo, nome, estoque_atual, preco_venda, categorias_produto(nome)",
        )
        .order("nome");
      if (error) throw new Error(error.message);
      return data as Produto[];
    },
  });

  if (error) {
    return (
      <div className="text-red-500">
        Erro ao carregar produtos: {error.message}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catálogo de Produtos</CardTitle>
        <CardDescription>
          Visualize e gerencie todos os produtos cadastrados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="w-[100px]">Estoque</TableHead>
                <TableHead className="w-[120px]">Preço</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                : produtos && produtos.length > 0
                  ? produtos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-mono">
                          {produto.codigo}
                        </TableCell>
                        <TableCell className="font-medium">
                          {produto.nome}
                        </TableCell>
                        <TableCell>
                          {produto.categorias_produto?.nome ?? "N/A"}
                        </TableCell>
                        <TableCell>{produto.estoque_atual}</TableCell>
                        <TableCell>
                          {produto.preco_venda.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onEdit(produto.id)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeletingProduto(produto)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhum produto encontrado.
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <DeleteProdutoAlert
        produto={deletingProduto}
        open={!!deletingProduto}
        onOpenChange={(open) => !open && setDeletingProduto(null)}
      />
    </Card>
  );
};