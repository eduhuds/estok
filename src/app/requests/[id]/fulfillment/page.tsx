import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import FulfillmentForm from "./fulfillment-form"

export default async function FulfillmentPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  const req = await db.materialRequest.findUnique({
    where: { id },
    include: {
      requester: true,
      warehouse: true,
      items: {
        include: {
          product: { 
            include: { 
              stocks: {
                include: { location: true }
              } 
            } 
          },
          unit: true
        }
      }
    }
  })

  if (!req) notFound()

  // Em produção, buscar da sessão real
  const userAlmox = await db.user.findFirst({ where: { role: { name: 'ALMOXARIFE' } } })
  const mockUserId = userAlmox?.id || ""

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <FulfillmentForm request={req} userId={mockUserId} />
    </div>
  )
}
