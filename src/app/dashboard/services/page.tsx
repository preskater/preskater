import { requireCrmContext } from "@/lib/crm/context"
import { getProductOptions, listServices } from "@/lib/crm/queries"

import { ServicesTable } from "./services-table"

export default async function ServicesPage() {
  const context = await requireCrmContext()
  const [rows, productOptions] = await Promise.all([
    listServices(context.organizationId),
    getProductOptions(context.organizationId),
  ])

  return <ServicesTable rows={rows} productOptions={productOptions} />
}
