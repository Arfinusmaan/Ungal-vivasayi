import { createContext, useContext, useState, useEffect } from 'react'

const defaultProducts = [
  {
    id: 1,
    name: 'Cold Pressed Coconut Oil',
    price: 320,
    category: 'Oil',
    unit: '500ml',
    image: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: 2,
    name: 'Wood Pressed Groundnut Oil',
    price: 280,
    category: 'Oil',
    unit: '500ml',
    image: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: 3,
    name: 'Sesame Oil (Gingelly)',
    price: 350,
    category: 'Oil',
    unit: '500ml',
    image: 'https://picsum.photos/400/400?random=3'
  },
  {
    id: 4,
    name: 'Castor Oil — Pure',
    price: 220,
    category: 'Oil',
    unit: '250ml',
    image: 'https://picsum.photos/400/400?random=4'
  },
  {
    id: 5,
    name: 'Neem Oil Concentrate',
    price: 180,
    category: 'Oil',
    unit: '250ml',
    image: 'https://picsum.photos/400/400?random=5'
  },
  {
    id: 6,
    name: 'Premium Engine Lubricant',
    price: 850,
    category: 'Lubricant',
    unit: '1L',
    image: 'https://picsum.photos/400/400?random=6'
  },
  {
    id: 7,
    name: 'Multi-Grade Motor Oil',
    price: 720,
    category: 'Lubricant',
    unit: '1L',
    image: 'https://picsum.photos/400/400?random=7'
  },
  {
    id: 8,
    name: 'Hydraulic Fluid — Grade 68',
    price: 950,
    category: 'Lubricant',
    unit: '1L',
    image: 'https://picsum.photos/400/400?random=8'
  },
  {
    id: 9,
    name: 'Gear Oil — EP 90',
    price: 680,
    category: 'Lubricant',
    unit: '1L',
    image: 'https://picsum.photos/400/400?random=9'
  },
  {
    id: 10,
    name: 'Organic Fertilizer Blend',
    price: 450,
    category: 'Agricultural',
    unit: '5kg',
    image: 'https://picsum.photos/400/400?random=10'
  },
  {
    id: 11,
    name: 'Bio Pesticide Spray',
    price: 340,
    category: 'Agricultural',
    unit: '500ml',
    image: 'https://picsum.photos/400/400?random=11'
  },
  {
    id: 12,
    name: 'Soil Enhancer Granules',
    price: 290,
    category: 'Agricultural',
    unit: '2kg',
    image: 'https://picsum.photos/400/400?random=12'
  },
]

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('uv_products')
    return saved ? JSON.parse(saved) : defaultProducts
  })

  const [invoiceNumber, setInvoiceNumber] = useState(() => {
    const saved = localStorage.getItem('uv_invoice_number')
    return saved ? parseInt(saved) : 1001
  })

  useEffect(() => {
    localStorage.setItem('uv_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('uv_invoice_number', invoiceNumber.toString())
  }, [invoiceNumber])

  const addProduct = (product) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1
    setProducts(prev => [...prev, { ...product, id: newId }])
  }

  const updateProduct = (id, updated) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p))
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const getNextInvoiceNumber = () => {
    const num = invoiceNumber
    setInvoiceNumber(prev => prev + 1)
    return num
  }

  return (
    <ProductContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct, getNextInvoiceNumber, invoiceNumber
    }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => useContext(ProductContext)
