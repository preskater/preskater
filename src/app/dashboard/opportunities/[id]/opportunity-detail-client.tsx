"use client"

import * as React from "react"

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
import { opportunityLineItemSchema } from "@/lib/schemas/crm"
import {
  addOpportunityLineItem,
  deleteOpportunityLineItem,
} from "../actions"

type Option = { label: string; value: string }

type LineItem = {
  id: string
  productName: string
  quantity: number
  unitPrice: number | null
  discount: number | null
}

export function OpportunityLineItems({
  opportunityId,
  items,
  productOptions,
}: {
  opportunityId: string
  items: LineItem[]
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
    { name: "discount", label: "Remise (%)", type: "number", step: "0.01" },
  ]

  const total = items.reduce(
    (sum, item) =>
      sum +
      (item.unitPrice ?? 0) *
        item.quantity *
        (1 - (item.discount ?? 0) / 100),
    0
  )

  return (
    <DetailCard
      title="Produits"
      description={`${items.length} ligne(s) · ${formatCurrency(total)}`}
      action={
        <ResourceFormDialog
          title="Ajouter un produit"
          triggerLabel="Ajouter"
          schema={opportunityLineItemSchema}
          defaultValues={{ quantity: 1, discount: 0 }}
          fields={fields}
          action={(values) => addOpportunityLineItem(values, opportunityId)}
        />
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead className="text-right">Qté</TableHead>
            <TableHead className="text-right">Prix unit.</TableHead>
            <TableHead className="text-right">Remise</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[1%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Aucune ligne.
              </TableCell>
            </TableRow>
          )}
          {items.map((item) => {
            const lineTotal =
              (item.unitPrice ?? 0) *
              item.quantity *
              (1 - (item.discount ?? 0) / 100)
            return (
              <TableRow key={item.id}>
                <TableCell>{item.productName}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {item.discount ?? 0} %
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(lineTotal)}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteButton
                    id={item.id}
                    name={item.productName}
                    action={deleteOpportunityLineItem}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </DetailCard>
  )
}
