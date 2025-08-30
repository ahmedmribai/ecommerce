import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/product/ProductCard'
import { FiFilter, FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Products = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, selectedCategory, priceRange, sortBy, searchParams])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://fakestoreapi.com/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]
    
    // Search filter
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    const categoryParam = searchParams.get('category')
    const activeCategory = selectedCategory || categoryParam
    if (activeCategory) {
      filtered = filtered.filter(product => product.category === activeCategory)
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )

    // Sorting
    switch (sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
        break
      default:
        // Featured/default sorting
        break
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Products</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 btn-secondary"
          >
            {showFilters ? <FiX /> : <FiFilter />}
            <span>{showFilters ? 'Close' : 'Filters'}</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!selectedCategory}
                      onChange={() => setSelectedCategory('')}
                      className="mr-2"
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map(category => (
                    <label key={category} className="flex items-center capitalize">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="mr-2"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Min: ${priceRange.min}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max: ${priceRange.max}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="featured">Featured</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </motion.div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <p className="text-gray-600 mb-4">
                  Showing {filteredProducts.length} products
                  {searchParams.get('search') && ` for "${searchParams.get('search')}"`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
