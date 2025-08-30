import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { useCartStore } from '../../store/cartStore'
import { useState } from 'react'

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="card group"
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm rounded">
              -{product.discount}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <FiHeart className={`text-lg ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 clamp-2 hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating?.rate || 4)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({product.rating?.count || 0})
              </span>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
