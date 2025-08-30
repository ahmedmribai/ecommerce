import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="text-9xl font-bold text-primary-600 mb-4"
        >
          404
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center space-x-2"
          >
            <FiHome />
            <span>Go to Homepage</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center space-x-2"
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-12">
          <p className="text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/products" className="text-primary-600 hover:text-primary-700 underline">
              Products
            </Link>
            <Link to="/cart" className="text-primary-600 hover:text-primary-700 underline">
              Cart
            </Link>
            <Link to="/login" className="text-primary-600 hover:text-primary-700 underline">
              Login
            </Link>
            <Link to="/register" className="text-primary-600 hover:text-primary-700 underline">
              Register
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
