import { requireCrmContext } from "@/lib/crm/context"
import { listProducts } from "@/lib/crm/queries"

import { ProductsTable } from "./products-table"

export default async function ProductsPage() {
  const context = await requireCrmContext()
  const rows = await listProducts(context.organizationId)

  return <ProductsTable rows={rows} />
}
