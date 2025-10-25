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
import { MoreHorizontal, Pencil, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DeleteClienteAlert } from "./DeleteClienteAlert";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "../ui/input";

interface Veiculo {
  marca: string;
  modelo: string;
}

interface Cliente {
  id: string;
  nome: string;
  veiculos: Veiculo[];
}

interface ClientesTableProps {
  onEdit: (id: string) => void;
}

export const ClientesTable = ({ onEdit }: ClientesTableProps) => {
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: clientes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clientes", "veiculos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("id, nome, veiculos(marca, modelo)")
        .order("nome");
      if (error) throw new Error(error.message);
      return data as Cliente[];
    },
  });

  const filteredClientes = clientes?.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (error) {
    return (
      <div className="text-red-500">
        Erro ao carregar clientes: {error.message}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Clientes</CardTitle>
        <CardDescription>
          Busque, visualize e gerencie todos os seus clientes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Moto</TableHead>
                <TableHead className="w-[150px]">Em Aberto</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : filteredClientes && filteredClientes.length > 0
                  ? filteredClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">
                          {cliente.nome}
                        </TableCell>
                        <TableCell>
                          {cliente.veiculos[0]
                            ? `${cliente.veiculos[0].marca} ${cliente.veiculos[0].modelo}`
                            : "Nenhum veículo"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span>R$ 0,00</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onEdit(cliente.id)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeletingCliente(cliente)}
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
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <DeleteClienteAlert
        cliente={deletingCliente}
        open={!!deletingCliente}
        onOpenChange={(open) => !open && setDeletingCliente(null)}
      />
    </Card>
  );
};