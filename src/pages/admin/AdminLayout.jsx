import { NavLink, Outlet, Link } from 'react-router-dom'
import { FiBarChart2, FiBox, FiClipboard } from 'react-icons/fi'
import { ToastProvider } from '../../components/ToastContext'

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 rounded-lg transition group relative
   ${isActive ? 'bg-primary-50 text-primary-700 font-semibold border border-primary-100' : 'text-gray-700 hover:bg-gray-50'}`

const AdminLayout = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 shadow-sm flex-col">
          <div className="h-20 border-b flex items-center px-6">
            <Link to="/" className="group">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                ShopZone
              </span>
              <span className="block text-xs text-gray-400 group-hover:text-gray-500">Admin Panel</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <NavLink end to="/admin" className={navLinkClass}>
              <FiBarChart2 />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              <FiBox />
              <span>Products</span>
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass}>
              <FiClipboard />
              <span>Orders</span>
            </NavLink>
          </nav>
          <div className="mt-auto p-4 border-t text-xs text-gray-400">v1.0 • Admin</div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Mobile top bar */}
          <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
            <span className="font-semibold">Admin Panel</span>
            <Link to="/" className="text-sm text-primary-600">Go to Store</Link>
          </div>

          <div className="container-custom py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}

export default AdminLayout
