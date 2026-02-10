import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useProducts } from '../context/ProductContext.jsx'

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream">
      {/* Heavenly background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-sage-light/30 blur-[120px] animate-slow-spin" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent-light/40 blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-white/60 blur-[100px]" />
        
        {/* Decorative text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center select-none overflow-hidden whitespace-nowrap opacity-[0.03] font-serif text-[21vw] leading-none pointer-events-none">
          VIVASAAYI
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-fade-up opacity-0">
          <span className="inline-block px-4 py-1.5 rounded-full border border-sage/20 text-sage text-[10px] font-bold uppercase tracking-[0.4em] mb-12">
            The Purest Connection to Nature
          </span>
        </div>

        <h1 className="animate-fade-up opacity-0 animate-delay-1 mb-12">
          <span className="block font-serif text-7xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] text-ink leading-[0.85] tracking-tighter">
            Ungal
          </span>
          <span className="block font-serif text-7xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] text-stroke leading-[0.85] tracking-tighter italic">
            Vivasaayi
          </span>
        </h1>

        <div className="max-w-2xl mx-auto space-y-10">
          <p className="animate-fade-up opacity-0 animate-delay-2 text-xl sm:text-2xl text-charcoal/60 leading-relaxed font-light">
            An elegant blend of Tamil Nadu's agricultural wisdom and modern design excellence.
          </p>

          <div className="animate-fade-up opacity-0 animate-delay-3 flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link to="/billing" className="group relative overflow-hidden px-12 py-5 bg-ink text-cream rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-500 hover:scale-105 active:scale-95">
              <span className="relative z-10">Experience Billing</span>
              <div className="absolute inset-0 bg-sage translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            <a href="#collection" className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-ink hover:text-sage transition-colors duration-300">
              Scroll to explore
              <span className="w-12 h-px bg-ink/20 group-hover:w-16 group-hover:bg-sage transition-all duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-20 left-20 w-32 h-32 rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 animate-float hidden lg:block" />
      <div className="absolute top-40 right-40 w-24 h-24 rounded-full bg-white/40 backdrop-blur-md border border-white/50 animate-float animate-delay-2 hidden lg:block" />
    </section>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-6 mb-8">
      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">{children}</span>
      <div className="flex-1 h-px bg-sage/10" />
    </div>
  )
}

function Experience() {
  return (
    <section className="py-32 lg:py-48 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000" 
              alt="Farm" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em]">The Source</span>
              <h3 className="text-white font-serif text-3xl mt-2">Nurtured by the sun, harvested with heart.</h3>
            </div>
          </div>
          
          <div className="space-y-12">
            <SectionLabel>Our Philosophy</SectionLabel>
            <h2 className="font-serif text-5xl lg:text-7xl text-ink leading-tight">
              Purity is not a process. It&apos;s a <span className="italic text-sage">promise.</span>
            </h2>
            <p className="text-xl text-charcoal/50 leading-relaxed font-light">
              We believe that agriculture is the highest form of art. At Ungal Vivasaayi, we don&apos;t just sell products; we deliver the essence of the earth, refined through generations of expertise and presented with modern elegance.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-8">
              <div>
                <span className="block font-serif text-4xl text-ink">100%</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mt-2 block">Natural Extraction</span>
              </div>
              <div>
                <span className="block font-serif text-4xl text-ink">Zero</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mt-2 block">Chemical Additives</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Products() {
  const { products } = useProducts()
  const categories = [...new Set(products.map(p => p.category))]
  const [imageErrors, setImageErrors] = useState({})

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  return (
    <section id="collection" className="py-32 lg:py-48 bg-warm relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-32">
          <SectionLabel>The Collection</SectionLabel>
          <h2 className="font-serif text-6xl lg:text-8xl text-ink mt-8">Selected Works</h2>
        </div>

        {categories.map((cat, catIdx) => (
          <div key={cat} className="mb-32 last:mb-0">
            <div className="flex items-center justify-between mb-16">
              <h3 className="font-serif text-3xl text-ink italic">{cat}s</h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted">{products.filter(p => p.category === cat).length} Products</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
              {products.filter(p => p.category === cat).map((product, idx) => (
                <div key={product.id} className={`group cursor-pointer ${idx % 2 === 1 ? 'md:mt-24' : ''}`}>
                  <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-white/50 border border-black/5 mb-8">
                    {product.image && !imageErrors[product.id] ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-sage-light/20">
                        <span className="font-serif text-6xl text-sage/20 italic">{product.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute top-6 right-6">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage">{product.unit}</span>
                      <h4 className="font-serif text-2xl text-ink mt-2 group-hover:text-sage transition-colors duration-300">{product.name}</h4>
                    </div>
                    <span className="font-serif text-3xl text-ink">&#8377;{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-48 text-center">
          <Link to="/billing" className="inline-block group">
            <span className="block font-serif text-5xl lg:text-7xl text-ink group-hover:text-sage transition-colors duration-500">
              Ready to create <br />an <span className="italic">invoice?</span>
            </span>
            <div className="mt-8 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.4em] text-muted group-hover:text-sage transition-all duration-500">
              Go to Smart Billing
              <div className="w-16 h-px bg-muted/20 group-hover:w-24 group-hover:bg-sage transition-all duration-500" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Experience />
      <Products />
    </div>
  )
}
