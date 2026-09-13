import { db } from "@/lib/db"
import RequestForm from "./request-form"

export default async function NewRequestPage() {
  const users = await db.user.findMany({ select: { id: true, name: true, role: { select: { name: true } } } })
  const warehouses = await db.warehouse.findMany({ where: { status: 'ACTIVE' } })
  const products = await db.product.findMany({ 
    where: { status: 'ACTIVE' },
    include: { unit: true } 
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <RequestForm 
        users={users} 
        warehouses={warehouses} 
        products={products} 
      />
    </div>
  )
}
