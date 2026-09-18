import { requireCrmContext } from "@/lib/crm/context"
import { getProductOptions, listServices } from "@/lib/crm/queries"

import { ServicesTable } from "./services-table"

export default async function ServicesPage() {
  await requireCrmContext()
  const [rows, productOptions] = await Promise.all([
    listServices(),
    getProductOptions(),
  ])

  return <ServicesTable rows={rows} productOptions={productOptions} />
}
