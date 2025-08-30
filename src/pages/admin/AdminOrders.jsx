import { useEffect, useMemo, useState } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { useToast } from '../../components/ToastContext'

const statusOptions = ['pending', 'shipped', 'delivered']

const statusBadgeClass = (s) => (s === 'pending' ? 'badge-warning' : s === 'shipped' ? 'badge-info' : 'badge-success')

const AdminOrders = () => {
  const { orders, fetchOrders, updateOrderStatus } = useAdminStore()
  const [filter, setFilter] = useState('all')
  const [initializing, setInitializing] = useState(true)
  const { addToast } = useToast()
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!orders || orders.length === 0) {
        await fetchOrders()
      }
      if (mounted) setInitializing(false)
    })()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    return filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  }, [orders, filter])

  const sortedFiltered = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'customer') {
        return sortOrder === 'asc' ? a.customer.name.localeCompare(b.customer.name) : b.customer.name.localeCompare(a.customer.name)
      }
      if (sortBy === 'total') {
        return sortOrder === 'asc' ? a.total - b.total : b.total - a.total
      }
      if (sortBy === 'date') {
        return sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)
      }
      return 0
    })
    return sorted
  }, [filtered, sortBy, sortOrder])

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return sortedFiltered.slice(start, end)
  }, [sortedFiltered, page, pageSize])

  const totalPages = Math.ceil(sortedFiltered.length / pageSize)

  const counts = useMemo(() => {
    return orders.reduce(
      (acc, o) => ({ ...acc, [o.status]: (acc[o.status] || 0) + 1 }),
      { pending: 0, shipped: 0, delivered: 0 }
    )
  }, [orders])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">View orders, customer details, and update status.</p>
      </div>

      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <span className="text-sm text-gray-600">Filter:</span>
        <button className={`px-3 py-1 rounded border ${filter==='all'?'bg-primary-50 text-primary-700 border-primary-200':'border-gray-300'}`} onClick={()=>setFilter('all')} aria-label="Filter by all orders">All</button>
        {statusOptions.map((s)=> (
          <button key={s} className={`px-3 py-1 rounded border ${filter===s?'bg-primary-50 text-primary-700 border-primary-200':'border-gray-300'}`} onClick={()=>setFilter(s)} aria-label={`Filter by ${s} orders`}>
            {s.charAt(0).toUpperCase()+s.slice(1)} ({counts[s]||0})
          </button>
        ))}
      </div>

      <div className="card p-6 overflow-x-auto">
        <table aria-live="polite" className="table-admin">
          <thead>
            <tr>
              <th className="py-2 pr-4">Order ID</th>
              <th className="py-2 pr-4 cursor-pointer" onClick={() => {
                if (sortBy === 'customer') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy('customer')
                  setSortOrder('asc')
                }
              }} aria-label="Sort by customer">Customer {sortBy === 'customer' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th className="py-2 pr-4">Items</th>
              <th className="py-2 pr-4 cursor-pointer" onClick={() => {
                if (sortBy === 'total') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy('total')
                  setSortOrder('asc')
                }
              }} aria-label="Sort by total">Total {sortBy === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4 cursor-pointer" onClick={() => {
                if (sortBy === 'date') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy('date')
                  setSortOrder('desc')
                }
              }} aria-label="Sort by date">Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            </tr>
          </thead>
          <tbody>
            {initializing && sortedFiltered.length === 0 && (
              [...Array(4)].map((_, i) => (
                <tr key={`sk-${i}`} className="border-t animate-pulse align-top">
                  <td className="py-2 pr-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                  <td className="py-2 pr-4">
                    <div className="h-4 w-36 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-40 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </td>
                  <td className="py-2 pr-4">
                    <div className="space-y-1">
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                      <div className="h-3 w-28 bg-gray-200 rounded" />
                    </div>
                  </td>
                  <td className="py-2 pr-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                  <td className="py-2 pr-4"><div className="h-8 w-40 bg-gray-200 rounded" /></td>
                  <td className="py-2 pr-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                </tr>
              ))
            )}
            {!initializing && sortedFiltered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No orders{filter !== 'all' ? ' for this filter' : ''}.
                </td>
              </tr>
            )}
            {paginatedOrders.map((o) => (
              <tr key={o.id} className="border-t align-top">
                <td className="py-2 pr-4 font-mono text-xs">{o.id}</td>
                <td className="py-2 pr-4">
                  <div className="font-medium">{o.customer?.name}</div>
                  <div className="text-gray-500 text-xs">{o.customer?.email}</div>
                  <div className="text-gray-500 text-xs">{o.address}</div>
                </td>
                <td className="py-2 pr-4">
                  <ul className="space-y-1">
                    {o.items?.map((it, idx) => (
                      <li key={idx} className="text-gray-700">
                        <span className="font-medium">{it.title}</span> × {it.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 pr-4 font-semibold">${Number(o.total).toFixed(2)}</td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${statusBadgeClass(o.status)}`}>
                      {o.status.charAt(0).toUpperCase()+o.status.slice(1)}
                    </span>
                    <select
                      value={o.status}
                      onChange={(e) => {

                        updateOrderStatus(o.id, e.target.value)

                        addToast('Order status updated to ' + e.target.value, 'success')

                      }}
                      className="select"
                      aria-label="Update order status"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase()+s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        {sortedFiltered.length > pageSize && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing { (page - 1) * pageSize + 1 } to { Math.min(page * pageSize, sortedFiltered.length) } of { sortedFiltered.length } orders
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary px-3 py-1" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page">Prev</button>
              <span className="px-3 py-1 text-sm">Page {page} of {totalPages}</span>
              <button className="btn-secondary px-3 py-1" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Next page">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default AdminOrders
