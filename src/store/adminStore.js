import { create } from 'zustand'
import axios from 'axios'

const STORAGE_KEYS = {
  products: 'admin_products',
  orders: 'admin_orders',
}

const loadStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const saveStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const useAdminStore = create((set, get) => ({
  products: [],
  orders: [],
  loading: false,

  // PRODUCTS
  fetchProducts: async () => {
    set({ loading: true })
    try {
      const [apiRes, localProducts] = await Promise.all([
        axios.get('https://fakestoreapi.com/products'),
        Promise.resolve(loadStorage(STORAGE_KEYS.products, [])),
      ])
      // Combine API products with locally added ones
      const combined = [...apiRes.data, ...localProducts]
      set({ products: combined })
    } catch (e) {
      // fallback to local
      const localProducts = loadStorage(STORAGE_KEYS.products, [])
      set({ products: localProducts })
      console.error('fetchProducts failed, showing local only:', e)
    } finally {
      set({ loading: false })
    }
  },

  addProduct: (payload) => {
    const newProduct = {
      id: `local-${Date.now()}`,
      title: payload.title,
      price: Number(payload.price) || 0,
      category: payload.category || 'uncategorized',
      description: payload.description || '',
      image: payload.image || payload.imageUrl || '',
    }
    const localProducts = loadStorage(STORAGE_KEYS.products, [])
    const updatedLocal = [newProduct, ...localProducts]
    saveStorage(STORAGE_KEYS.products, updatedLocal)

    // reflect in combined list shown in UI
    set({ products: [newProduct, ...get().products] })
    return newProduct
  },

  updateProduct: (id, updates) => {
    // Update local storage only for local products
    const localProducts = loadStorage(STORAGE_KEYS.products, [])
    const localIdx = localProducts.findIndex((p) => p.id === id)
    if (localIdx !== -1) {
      const merged = { ...localProducts[localIdx], ...updates }
      const nextLocal = [...localProducts]
      nextLocal[localIdx] = merged
      saveStorage(STORAGE_KEYS.products, nextLocal)
    }

    // Update UI list (local or API item) for current session
    set({
      products: get().products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })
  },

  deleteProduct: (id) => {
    // Remove from local storage if local
    const localProducts = loadStorage(STORAGE_KEYS.products, [])
    const nextLocal = localProducts.filter((p) => p.id !== id)
    if (nextLocal.length !== localProducts.length) {
      saveStorage(STORAGE_KEYS.products, nextLocal)
    }

    // Remove from UI
    set({ products: get().products.filter((p) => p.id !== id) })
  },

  // ORDERS
  fetchOrders: async () => {
    try {
      const stored = loadStorage(STORAGE_KEYS.orders, null)
      if (stored) {
        set({ orders: stored })
        return
      }
      // Seed demo orders if none exist
      const products = get().products.length ? get().products : (await axios.get('https://fakestoreapi.com/products')).data
      const sampleCustomers = [
        { name: 'Alice Johnson', email: 'alice@example.com' },
        { name: 'Mark Chen', email: 'mark@example.com' },
        { name: 'Sara Khan', email: 'sara@example.com' },
        { name: 'John Smith', email: 'john@example.com' },
      ]
      const statuses = ['pending', 'shipped', 'delivered']
      const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
      const pick = (arr) => arr[rand(0, arr.length - 1)]

      const demo = Array.from({ length: 8 }).map((_, i) => {
        const itemsCount = rand(1, 4)
        const items = Array.from({ length: itemsCount }).map(() => {
          const prod = pick(products)
          const qty = rand(1, 3)
          return { id: prod.id, title: prod.title, price: Number(prod.price) || 0, quantity: qty }
        })
        const total = items.reduce((s, it) => s + it.price * it.quantity, 0)
        const daysAgo = rand(0, 14)
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)
        const customer = pick(sampleCustomers)
        return {
          id: `ord-${Date.now()}-${i}`,
          customer,
          items,
          total: Number(total.toFixed(2)),
          status: pick(statuses),
          createdAt: date.toISOString(),
          address: `${rand(100, 999)} Market St, Cityville`,
        }
      })
      saveStorage(STORAGE_KEYS.orders, demo)
      set({ orders: demo })
    } catch (e) {
      console.error('fetchOrders failed', e)
    }
  },

  updateOrderStatus: (orderId, status) => {
    set({
      orders: get().orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    })
    const updated = get().orders.map((o) => (o.id === orderId ? { ...o, status } : o))
    saveStorage(STORAGE_KEYS.orders, updated)
  },
}))
