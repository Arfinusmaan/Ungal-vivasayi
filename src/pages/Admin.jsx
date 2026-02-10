import { useState } from 'react'
import { useProducts } from '../context/ProductContext.jsx'

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [editingId, setEditingId] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', category: 'Oil', unit: '', image: '' })
  const [editForm, setEditForm] = useState({})
  const [imageErrors, setImageErrors] = useState({})

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  const handleImageUpload = (event, isEdit) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target.result
        if (isEdit) {
          setEditForm({ ...editForm, image: base64 })
        } else {
          setForm({ ...form, image: base64 })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdd = () => {
    if (!form.name || !form.price || !form.unit) return
    addProduct({ ...form, price: parseFloat(form.price) })
    setForm({ name: '', price: '', category: 'Oil', unit: '', image: '' })
    setShowAdd(false)
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setEditForm({ 
      name: product.name, 
      price: product.price, 
      category: product.category, 
      unit: product.unit,
      image: product.image || ''
    })
  }

  const saveEdit = (id) => {
    if (!editForm.name || !editForm.price) return
    updateProduct(id, { ...editForm, price: parseFloat(editForm.price) })
    setEditingId(null)
  }

  const categories = ['Oil', 'Lubricant', 'Agricultural']

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-muted">Administration</span>
            <h1 className="font-serif text-4xl lg:text-5xl text-ink mt-2">Product Control</h1>
            <p className="mt-3 text-charcoal/50">Manage your product catalog. Changes are saved automatically.</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              showAdd
                ? 'bg-charcoal/5 text-charcoal'
                : 'bg-ink text-cream hover:bg-charcoal hover:shadow-lg'
            }`}
          >
            {showAdd ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                Cancel
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                Add Product
              </>
            )}
          </button>
        </div>

        {/* Add Product Form */}
        <div className={`overflow-hidden transition-all duration-500 ${showAdd ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white rounded-2xl border border-sage/20 p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-sage font-semibold">New Product</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 bg-cream rounded-xl text-sm text-ink placeholder:text-muted/50 border-0 outline-none focus:ring-2 focus:ring-sage/20"
              />
              <input
                type="number"
                placeholder="Price (&#8377;)"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="px-4 py-3 bg-cream rounded-xl text-sm text-ink placeholder:text-muted/50 border-0 outline-none focus:ring-2 focus:ring-sage/20"
              />
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="px-4 py-3 bg-cream rounded-xl text-sm text-ink border-0 outline-none focus:ring-2 focus:ring-sage/20 appearance-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
                <input
                  type="text"
                  placeholder="Unit (e.g., 500ml, 1L, 5kg)"
                  value={form.unit}
                  onChange={e => setForm({ ...form, unit: e.target.value })}
                  className="px-4 py-3 bg-cream rounded-xl text-sm text-ink placeholder:text-muted/50 border-0 outline-none focus:ring-2 focus:ring-sage/20"
                />
                <div className="sm:col-span-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Image URL (optional)"
                    value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    className="px-4 py-3 bg-cream rounded-xl text-sm text-ink placeholder:text-muted/50 border-0 outline-none focus:ring-2 focus:ring-sage/20 w-full"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">or</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="text-xs text-muted file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-sage file:text-white hover:file:bg-sage/90"
                    />
                  </div>
                </div>
              </div>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-sage text-white rounded-xl text-sm font-medium hover:bg-sage/90 transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-3">
          {products.map(product => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                editingId === product.id ? 'border-sage/30 shadow-lg shadow-sage/5' : 'border-charcoal/5 hover:border-charcoal/10'
              }`}
            >
              {editingId === product.id ? (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="px-4 py-3 bg-cream rounded-xl text-sm text-ink border-0 outline-none focus:ring-2 focus:ring-sage/20"
                    />
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                      className="px-4 py-3 bg-cream rounded-xl text-sm text-ink border-0 outline-none focus:ring-2 focus:ring-sage/20"
                    />
                    <select
                      value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                      className="px-4 py-3 bg-cream rounded-xl text-sm text-ink border-0 outline-none focus:ring-2 focus:ring-sage/20 appearance-none"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                      <input
                        type="text"
                        value={editForm.unit}
                        onChange={e => setEditForm({ ...editForm, unit: e.target.value })}
                        className="px-4 py-3 bg-cream rounded-xl text-sm text-ink border-0 outline-none focus:ring-2 focus:ring-sage/20"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={editForm.image}
                        onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                        className="px-4 py-3 bg-cream rounded-xl text-sm text-ink border-0 outline-none focus:ring-2 focus:ring-sage/20 sm:col-span-2"
                      />
                    </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(product.id)}
                      className="px-5 py-2.5 bg-sage text-white rounded-xl text-sm font-medium hover:bg-sage/90 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-5 py-2.5 bg-cream text-charcoal rounded-xl text-sm font-medium hover:bg-charcoal/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cream overflow-hidden shrink-0 border border-charcoal/5">
                    {product.image && !imageErrors[product.id] ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={() => handleImageError(product.id)} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-muted">{product.category.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-ink truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted">{product.category}</span>
                      <span className="w-1 h-1 rounded-full bg-charcoal/15" />
                      <span className="text-xs text-muted">{product.unit}</span>
                    </div>
                  </div>
                  <span className="font-serif text-lg text-ink shrink-0">&#8377;{product.price}</span>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(product)}
                      className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-muted hover:text-sage hover:bg-sage/10 transition-all"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted">No products yet. Click "Add Product" to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
