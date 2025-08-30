import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import ProductCard from '../components/product/ProductCard'
import axios from 'axios'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products?limit=4')
      setFeaturedProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <FiTruck className="text-3xl" />,
      title: "Free Shipping",
      description: "On orders over $50"
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: <FiRefreshCw className="text-3xl" />,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: <FiShoppingBag className="text-3xl" />,
      title: "Quality Products",
      description: "Authentic brands only"
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        {/* decorative glows */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="container-custom py-28 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center text-sm font-medium px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4">
              New Season Arrivals
            </span>
            <h1 className="text-5xl font-bold mb-6">
              Welcome to ShopZone
            </h1>
            <p className="text-xl mb-8 text-white/80">
              Discover amazing products at unbeatable prices. Shop the latest trends in fashion, electronics, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="px-5 py-3 rounded-full bg-white text-primary-700 font-semibold shadow-md hover:bg-gray-100 transition">
                Shop Now
              </Link>
              <Link to="/products?category=sale" className="px-5 py-3 rounded-full border border-white/30 text-white bg-white/10 hover:bg-white/15 backdrop-blur-sm transition">
                View Sale Items
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50" preserveAspectRatio="none" viewBox="0 0 1440 54">
            <path fill="currentColor" d="M0,22L60,27.7C120,33,240,45,360,45.7C480,47,600,37,720,30.3C840,23,960,20,1080,23.7C1200,27,1320,37,1380,41.3L1440,47L1440,54L1380,54C1320,54,1200,54,1080,54C960,54,840,54,720,54C600,54,480,54,360,54C240,54,120,54,60,54L0,54Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link to="/products" className="btn-primary">
                View All Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter and get 10% off your first purchase
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
