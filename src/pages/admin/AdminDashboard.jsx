import { useEffect, useMemo, useState } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { FiDollarSign, FiShoppingBag, FiClock, FiCheckCircle } from 'react-icons/fi'

const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0)

const SalesChart = ({ data }) => {
  const [lib, setLib] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    setLoading(true)
    import('recharts')
      .then((mod) => {
        if (mounted) {
          setLib(mod)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="h-[320px] card p-4 animate-pulse">
        <div className="h-full flex items-end gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-1 bg-gray-200 rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!lib) {
    return (
      <div className="h-[320px] flex items-center justify-center rounded-xl bg-white border border-gray-200">
        <div className="text-center px-6">
          <p className="text-gray-700 font-medium mb-1">Sales chart</p>
          <p className="text-sm text-gray-500 mb-2">Install the chart library to enable analytics</p>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">npm i recharts</code>
        </div>
      </div>
    )
  }

  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } = lib
  return (
    <div className="h-[320px] card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="sales" stroke="#2563eb" fill="url(#salesGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="card p-5 flex items-start gap-4">
    <div className="h-11 w-11 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-primary-600 to-purple-600 shadow">
      <Icon className="text-lg" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
)

const AdminDashboard = () => {
  const { orders, fetchOrders } = useAdminStore()
  const [initializing, setInitializing] = useState(true)

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

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0)
    const totalOrders = orders.length
    const statusCounts = orders.reduce(
      (acc, o) => ({ ...acc, [o.status]: (acc[o.status] || 0) + 1 }),
      { pending: 0, shipped: 0, delivered: 0 }
    )
    return { totalRevenue, totalOrders, statusCounts }
  }, [orders])

  const chartData = useMemo(() => {
    // last 7 days
    const days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const key = d.toISOString().slice(0, 10)
      const label = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d)
      return { key, label }
    })
    const map = Object.fromEntries(days.map((d) => [d.key, 0]))
    orders.forEach((o) => {
      const k = (o.createdAt || '').slice(0, 10)
      if (k in map) map[k] += Number(o.total) || 0
    })
    return days.map((d) => ({ name: d.label, sales: Number(map[d.key].toFixed(2)) }))
  }, [orders])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your store performance</p>
      </div>

      {/* Stat cards */}
      {initializing && orders.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={`sk-${i}`} className="card p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-lg bg-gray-200" />
                <div className="flex-1">
                  <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-5 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={FiDollarSign} />
          <StatCard title="Total Orders" value={stats.totalOrders} icon={FiShoppingBag} />
          <StatCard title="Pending" value={stats.statusCounts.pending} icon={FiClock} />
          <StatCard title="Delivered" value={stats.statusCounts.delivered} icon={FiCheckCircle} />
        </div>
      )}

      {/* Sales Chart */}
      <SalesChart data={chartData} />
    </div>
  )
}

export default AdminDashboard
