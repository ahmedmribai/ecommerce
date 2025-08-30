import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { useCartStore } from '../store/cartStore'

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border-b last:border-b-0"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-contain"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          <Link to={`/products/${item.id}`} className="hover:text-primary-600">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <FiMinus />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="p-6 bg-gray-50">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 sticky top-20"
          >
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{getTotalPrice() > 50 ? 'Free' : '$10.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">
                  ${(getTotalPrice() + (getTotalPrice() > 50 ? 0 : 10) + (getTotalPrice() * 0.08)).toFixed(2)}
                </span>
              </div>
            </div>
            
            <Link to="/checkout" className="btn-primary w-full text-center block">
              Proceed to Checkout
            </Link>
            
            <Link to="/products" className="text-center block mt-4 text-primary-600 hover:text-primary-700">
              Continue Shopping
            </Link>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                {getTotalPrice() > 50 
                  ? '✓ Your order qualifies for free shipping!' 
                  : `Add $${(50 - getTotalPrice()).toFixed(2)} more for free shipping`}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart
