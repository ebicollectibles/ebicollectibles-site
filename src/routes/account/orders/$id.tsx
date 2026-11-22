import { createFileRoute } from '@tanstack/react-router'
import { requireCustomer } from '~/server/customer-auth'
import { getMyOrder } from '~/server/customers'
import { OrderDetail } from '~/components/OrderDetail'

export const Route = createFileRoute('/account/orders/$id')({
  beforeLoad: ({ location }) => requireCustomer(location.pathname),
  loader: ({ params }) => getMyOrder({ data: { id: params.id } }),
  component: OrderDetailPage,
})

function OrderDetailPage() {
  return <OrderDetail order={Route.useLoaderData()} view="account" />
}
