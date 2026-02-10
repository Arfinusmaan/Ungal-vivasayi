import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext.jsx'

export default function Billing() {
  const { products, getNextInvoiceNumber } = useProducts()
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [imageErrors, setImageErrors] = useState({})

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  const categories = ['All', ...new Set(products.map(p => p.category))]

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCat && matchSearch
  })

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.id !== id))
      return
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item))
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + tax

  const handleGenerateInvoice = () => {
    if (cart.length === 0) return
    const invoiceData = {
      invoiceNumber: getNextInvoiceNumber(),
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      customer: { name: customerName || 'Walk-in Customer', phone: customerPhone },
      items: cart,
      subtotal,
      tax,
      total,
    }
    localStorage.setItem('uv_current_invoice', JSON.stringify(invoiceData))
    navigate('/invoice')
  }

  const cartItemCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-muted">Smart Billing</span>
          <h1 className="font-serif text-4xl lg:text-5xl text-ink mt-2">Product Configurator</h1>
          <p className="mt-3 text-charcoal/50 max-w-lg">Select products, configure quantities, and generate beautiful invoices.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Product Selector */}
          <div className="xl:col-span-7 space-y-6">
            {/* Search and filter */}
            <div className="bg-white rounded-2xl p-5 border border-charcoal/5 space-y-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-cream rounded-xl text-sm text-ink placeholder:text-muted/50 border-0 outline-none focus:ring-2 focus:ring-sage/20 transition-shadow"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-ink text-cream'
                        : 'bg-cream text-charcoal/60 hover:bg-charcoal/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(product => {
                const inCart = cart.find(item => item.id === product.id)
                return (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`group text-left p-4 rounded-4xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                        inCart
                          ? 'bg-sage-light/30 border-sage/20 shadow-lg shadow-sage/5'
                          : 'bg-white border-charcoal/5 hover:border-sage/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-cream">
                          {product.image && !imageErrors[product.id] ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={() => handleImageError(product.id)} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-serif text-xl text-sage/20 italic">
                              {product.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-base text-ink truncate group-hover:text-sage transition-colors leading-tight">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{product.unit}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-charcoal/15" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-sage">{product.category}</span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-serif text-lg text-ink">&#8377;{product.price}</span>
                            {inCart && (
                              <span className="text-[10px] font-bold bg-sage text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">x{inCart.qty}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted">
                <p className="text-sm">No products found matching your search.</p>
              </div>
            )}
          </div>

          {/* Cart / Invoice Builder */}
          <div className="xl:col-span-5">
            <div className="sticky top-28 space-y-5">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl p-6 border border-charcoal/5">
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Customer Details</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Customer name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-ink placeholder:text-muted/50 border-0 outline-none focus:ring-2 focus:ring-sage/20 transition-shadow"
                  />
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-ink placeholder:text-muted/50 border-0 outline-none focus:ring-2 focus:ring-sage/20 transition-shadow"
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-2xl border border-charcoal/5 overflow-hidden">
                <div className="p-6 border-b border-charcoal/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-muted">Invoice Items</h3>
                    <span className="text-xs bg-sage/10 text-sage px-2.5 py-1 rounded-full font-medium">
                      {cartItemCount} item{cartItemCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-cream mx-auto mb-3 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted">Select products to add them here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-charcoal/5 max-h-85 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="p-4 flex items-center gap-3 hover:bg-cream/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-ink truncate">{item.name}</h4>
                          <span className="text-xs text-muted">&#8377;{item.price} x {item.qty}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-7 h-7 rounded-lg bg-cream flex items-center justify-center text-charcoal hover:bg-charcoal/10 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
                          </button>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={e => updateQty(item.id, parseInt(e.target.value) || 0)}
                            className="w-10 text-center text-sm font-medium bg-transparent border-0 outline-none text-ink"
                            min="0"
                          />
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-7 h-7 rounded-lg bg-cream flex items-center justify-center text-charcoal hover:bg-charcoal/10 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                          </button>
                        </div>
                        <div className="text-right w-16 shrink-0">
                          <span className="text-sm font-semibold text-ink">&#8377;{item.price * item.qty}</span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Totals */}
                {cart.length > 0 && (
                  <div className="p-6 bg-cream/50 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-medium text-ink">&#8377;{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">GST (5%)</span>
                      <span className="font-medium text-ink">&#8377;{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-px bg-charcoal/10" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-ink">Total</span>
                      <span className="font-serif text-2xl text-ink">&#8377;{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateInvoice}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  cart.length > 0
                    ? 'bg-ink text-cream hover:bg-charcoal hover:shadow-lg hover:shadow-ink/20 active:scale-[0.98]'
                    : 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8M16 17H8M10 9H8" />
                </svg>
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
