"use client"

import { DeleteButton } from "@/components/crm/delete-button"
import { DetailCard } from "@/components/crm/detail-card"
import {
  ResourceFormDialog,
  type FormFieldConfig,
} from "@/components/crm/resource-form-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/crm/labels"
import { orderItemSchema } from "@/lib/schemas/crm"
import { addOrderItem, deleteOrderItem } from "../actions"

type Option = { label: string; value: string }

type Item = {
  id: string
  productName: string
  quantity: number
  unitPrice: number | null
  subtotal: number | null
}

export function OrderItems({
  orderId,
  items,
  productOptions,
}: {
  orderId: string
  items: Item[]
  productOptions: Option[]
}) {
  const fields: FormFieldConfig[] = [
    {
      name: "productId",
      label: "Produit",
      type: "select",
      options: productOptions,
      fullWidth: true,
    },
    { name: "quantity", label: "Quantité", type: "number" },
    { name: "unitPrice", label: "Prix unitaire (€)", type: "number", step: "0.01" },
  ]

  return (
    <DetailCard
      title="Lignes de commande"
      description={`${items.length} ligne(s)`}
      action={
        <ResourceFormDialog
          title="Ajouter une ligne"
          triggerLabel="Ajouter"
          schema={orderItemSchema}
          defaultValues={{ quantity: 1 }}
          fields={fields}
          action={(values) => addOrderItem(values, orderId)}
        />
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead className="text-right">Qté</TableHead>
            <TableHead className="text-right">Prix unit.</TableHead>
            <TableHead className="text-right">Sous-total</TableHead>
            <TableHead className="w-[1%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Aucune ligne.
              </TableCell>
            </TableRow>
          )}
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.productName}</TableCell>
              <TableCell className="text-right tabular-nums">
                {item.quantity}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(item.unitPrice)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(item.subtotal)}
              </TableCell>
              <TableCell className="text-right">
                <DeleteButton
                  id={item.id}
                  name={item.productName}
                  action={deleteOrderItem}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DetailCard>
  )
}
