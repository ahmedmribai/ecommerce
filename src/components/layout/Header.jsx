import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiShield } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useCartStore } from '../../store/cartStore'
// removed axios

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [adminEnabled, setAdminEnabled] = useState(() => localStorage.getItem('admin_access') === 'true')
  // dropdowns removed
  const navigate = useNavigate()
  const location = useLocation()
  const { items } = useCartStore()
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0)

  // dropdown fetch removed

  // Simple guard: toggle admin link via query param ?admin=on|off
  useEffect(() => {
    const params = new URLSearchParams(location.search || '')
    const flag = params.get('admin')
    if (flag === 'on' || flag === '1' || flag === 'true') {
      localStorage.setItem('admin_access', 'true')
      setAdminEnabled(true)
    } else if (flag === 'off' || flag === '0' || flag === 'false') {
      localStorage.removeItem('admin_access')
      setAdminEnabled(false)
    }
  }, [location.search])

  const handleSearch = (e) => {
    e?.preventDefault?.()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">ShopZone</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-10 ml-6 lg:ml-12">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-all hover:scale-105">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-all hover:scale-105">
              All Products
            </Link>
            <Link 
              to="/products?category=men's clothing" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-all hover:scale-105"
            >
              Men
            </Link>
            <Link 
              to="/products?category=women's clothing" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-all hover:scale-105"
            >
              Women
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e)
                  }
                }}
                className="w-full px-4 py-3 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-full focus:outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 group-hover:bg-white group-hover:shadow-md"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <FiUser className="text-xl" />
              <span>Account</span>
            </Link>
            {adminEnabled && (
              <Link to="/admin" className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                <FiShield className="text-xl" />
                <span>Admin</span>
              </Link>
            )}
            
            <Link to="/cart" className="relative flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <FiShoppingCart className="text-xl" />
              <span className="hidden md:inline">Cart</span>
              {cartItemsCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>
            
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors py-2">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors py-2">
                All Products
              </Link>
              <Link to="/products?category=men's clothing" className="text-gray-700 hover:text-primary-600 transition-colors py-2">
                Men
              </Link>
              <Link to="/products?category=women's clothing" className="text-gray-700 hover:text-primary-600 transition-colors py-2">
                Women
              </Link>
              <Link to="/products?category=electronics" className="text-gray-700 hover:text-primary-600 transition-colors py-2">
                Electronics
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors py-2">
                Account
              </Link>
              {adminEnabled && (
                <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors py-2">
                  Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
