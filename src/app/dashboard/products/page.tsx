import { requireCrmContext } from "@/lib/crm/context"
import { listProducts } from "@/lib/crm/queries"

import { ProductsTable } from "./products-table"

export default async function ProductsPage() {
  await requireCrmContext()
  const rows = await listProducts()

  return <ProductsTable rows={rows} />
}
