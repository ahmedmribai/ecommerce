import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useCartStore } from '../store/cartStore'
import ProductCard from '../components/product/ProductCard'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
      setProduct(response.data)
      
      // Fetch related products from same category
      const relatedResponse = await axios.get(`https://fakestoreapi.com/products/category/${response.data.category}`)
      setRelatedProducts(relatedResponse.data.filter(p => p.id !== response.data.id).slice(0, 4))
    } catch (error) {
      console.error('Error fetching product:', error)
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2">
          <li><a href="/" className="text-gray-500 hover:text-primary-600">Home</a></li>
          <li className="text-gray-400">/</li>
          <li><a href="/products" className="text-gray-500 hover:text-primary-600">Products</a></li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 capitalize">{product.category}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-96 object-contain"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <FiHeart className={`text-xl ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            </div>
            
            {/* Thumbnail Images (placeholder for multiple images) */}
            <div className="flex gap-2 mt-4">
              {[product.image, product.image, product.image].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating?.rate || 4)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating?.rate} ({product.rating?.count} reviews)
              </span>
            </div>
          </div>

          <div className="border-t border-b py-4">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-green-600 mt-2">✓ In Stock</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-gray-300 rounded-lg py-2"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiShare2 className="text-xl" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Product Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Free shipping on orders over $50</li>
              <li>• 30-day return policy</li>
              <li>• Secure payment options</li>
              <li>• 1 year manufacturer warranty</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetail
