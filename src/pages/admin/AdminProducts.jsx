import { useEffect, useState, useMemo } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { useToast } from '../../components/ToastContext'

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const AdminProducts = () => {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct, loading } = useAdminStore()

  const [form, setForm] = useState({ title: '', price: '', category: '', description: '', image: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', price: '', category: '', description: '', image: '' })

  const { addToast } = useToast()
  const [sortBy, setSortBy] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      }
      if (sortBy === 'category') {
        return sortOrder === 'asc' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
      }
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      }
      return 0
    })
    return sorted
  }, [products, sortBy, sortOrder])

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return sortedProducts.slice(start, end)
  }, [sortedProducts, page, pageSize])

  const totalPages = Math.ceil(sortedProducts.length / pageSize)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.title) return
    await addProduct({ ...form, price: Number(form.price) || 0 })
    setForm({ title: '', price: '', category: '', description: '', image: '' })
    addToast('Product added successfully', 'success')
  }

  const onImageChange = async (e, set) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await readFileAsDataUrl(file)
    set((prev) => ({ ...prev, image: url }))
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditForm({ title: p.title, price: p.price, category: p.category, description: p.description, image: p.image })
  }

  const saveEdit = () => {
    updateProduct(editingId, { ...editForm, price: Number(editForm.price) || 0 })
    setEditingId(null)
    addToast('Product updated successfully', 'success')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Product Management</h1>
        <p className="text-gray-600">Add, edit, and delete products. Upload images are stored locally for demo.</p>
      </div>

      {/* Add new */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Price</label>
            <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Image</label>
            <input type="file" accept="image/*" onChange={(e) => onImageChange(e, setForm)} />
            {form.image && <img src={form.image} alt="preview" className="mt-2 h-20 w-20 object-contain border rounded" />}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea className="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary" aria-label="Add new product">Add Product</button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Products ({sortedProducts.length})</h2>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
        <div className="overflow-x-auto">
          <table aria-live="polite" className="table-admin">
            <thead>
              <tr>
                <th className="py-2 pr-4">Image</th>
                <th className="py-2 pr-4 cursor-pointer" onClick={() => {
                  if (sortBy === 'title') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy('title')
                    setSortOrder('asc')
                  }
                }} aria-label="Sort by title">Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th className="py-2 pr-4 cursor-pointer" onClick={() => {
                  if (sortBy === 'category') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy('category')
                    setSortOrder('asc')
                  }
                }} aria-label="Sort by category">Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th className="py-2 pr-4 cursor-pointer" onClick={() => {
                  if (sortBy === 'price') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy('price')
                    setSortOrder('asc')
                  }
                }} aria-label="Sort by price">Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Skeletons while loading */}
              {loading && products.length === 0 && (
                [...Array(4)].map((_, i) => (
                  <tr key={`sk-${i}`} className="border-t animate-pulse">
                    <td className="py-2 pr-4">
                      <div className="h-12 w-12 bg-gray-200 rounded" />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="h-4 w-48 bg-gray-200 rounded" />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="h-8 w-32 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              )}

              {/* Empty state */}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    No products yet. Use the form above to add your first product.
                  </td>
                </tr>
              )}

              {/* Normal rows */}
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2 pr-4">
                    {editingId === p.id ? (
                      <input type="file" accept="image/*" onChange={(e) => onImageChange(e, setEditForm)} />
                    ) : (
                      <img src={p.image} alt={p.title} className="h-12 w-12 object-contain" />
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {editingId === p.id ? (
                      <input className="input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    ) : (
                      <span className="font-medium">{p.title}</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {editingId === p.id ? (
                      <input className="input" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
                    ) : (
                      <span>{p.category}</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {editingId === p.id ? (
                      <input type="number" step="0.01" className="input w-28" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                    ) : (
                      <span>${Number(p.price).toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 space-x-2">
                    {editingId === p.id ? (
                      <>
                        <button className="btn-primary px-3 py-1" onClick={saveEdit} aria-label="Save changes">Save</button>
                        <button className="btn-secondary px-3 py-1" onClick={() => setEditingId(null)} aria-label="Cancel edit">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-secondary px-3 py-1" onClick={() => startEdit(p)} aria-label="Edit product">Edit</button>
                        <button className="px-3 py-1 border rounded text-red-600 hover:bg-red-50" onClick={() => { if (window.confirm('Delete this product?')) { deleteProduct(p.id); addToast('Product deleted', 'success') } }} aria-label="Delete product">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedProducts.length > pageSize && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing { (page - 1) * pageSize + 1 } to { Math.min(page * pageSize, sortedProducts.length) } of { sortedProducts.length } products
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary px-3 py-1" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page">Prev</button>
              <span className="px-3 py-1 text-sm">Page {page} of {totalPages}</span>
              <button className="btn-secondary px-3 py-1" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Next page">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
