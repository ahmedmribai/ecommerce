import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiLogOut, FiEdit2, FiSettings } from 'react-icons/fi'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [orders] = useState([
    {
      id: '1',
      date: '2024-01-15',
      status: 'Delivered',
      total: 125.99,
      items: [
        { name: 'Mens Casual Premium Slim Fit T-Shirts', quantity: 2, price: 22.3 },
        { name: 'Mens Cotton Jacket', quantity: 1, price: 55.99 }
      ]
    },
    {
      id: '2',
      date: '2024-01-10',
      status: 'Processing',
      total: 89.99,
      items: [
        { name: 'WD 2TB Elements Portable External Hard Drive', quantity: 1, price: 64 },
        { name: 'SanDisk SSD PLUS 1TB Internal SSD', quantity: 1, price: 109 }
      ]
    }
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="container-custom py-16 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="text-2xl text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold">{user.name || 'John Doe'}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                }`}
              >
                <FiUser />
                <span>Profile Information</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'orders' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                }`}
              >
                <FiPackage />
                <span>Order History</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'settings' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                }`}
              >
                <FiSettings />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <FiEdit2 />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FiUser className="text-gray-400" />
                    <span>{user.name || 'John Doe'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FiMail className="text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FiPhone className="text-gray-400" />
                    <span>+1 234 567 890</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FiMapPin className="text-gray-400" />
                    <span>123 Main St, City, State 12345</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-bold mb-6">Order History</h2>

              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <FiPackage className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                  <Link to="/products" className="btn-primary inline-block mt-4">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-lg font-semibold mt-2">${order.total}</p>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {item.name} x{item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end space-x-2 mt-3">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          View Details
                        </button>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Track Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-bold mb-6">Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span>Email notifications for orders</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>SMS notifications for delivery</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Newsletter and promotions</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Privacy</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span>Show profile to other users</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Allow personalized recommendations</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Account</h3>
                  <div className="space-y-2">
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      Change Password
                    </button>
                    <br />
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      Two-Factor Authentication
                    </button>
                    <br />
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
