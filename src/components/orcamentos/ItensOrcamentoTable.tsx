import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import type { ItemOrcamento } from "./NovoOrcamentoForm";

interface ItensOrcamentoTableProps {
  itens: ItemOrcamento[];
  onUpdateItem: (itemId: string, updates: Partial<ItemOrcamento>) => void;
  onRemoveItem: (itemId: string) => void;
}

export const ItensOrcamentoTable = ({
  itens,
  onUpdateItem,
  onRemoveItem,
}: ItensOrcamentoTableProps) => {
  if (itens.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">
          Nenhum item adicionado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="w-[100px]">Qtd.</TableHead>
            <TableHead className="w-[150px]">Vlr. Unit.</TableHead>
            <TableHead className="w-[150px] text-right">Vlr. Total</TableHead>
            <TableHead className="w-[50px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.nome}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="h-8"
                  value={item.quantidade}
                  onChange={(e) =>
                    onUpdateItem(item.id, {
                      quantidade: Number(e.target.value),
                    })
                  }
                  min={1}
                  disabled={item.tipo === "servico"}
                />
              </TableCell>
              <TableCell>
                {item.valor_unitario.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell className="text-right">
                {item.valor_total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};