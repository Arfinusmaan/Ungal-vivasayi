import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/billing', label: 'Billing' },
    { to: '/admin', label: 'Admin' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-cream/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-.3 4.3-.9" />
                <path d="M7 12c0-3 2-6 5-8" />
                <path d="M12 22c3-2 5-5 5-8" />
                <path d="M22 8c-3 0-6 2-8 5" />
                <path d="M17 3c0 3 2 6 5 8" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-xl text-ink tracking-tight">Ungal Vivasaayi</span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.25em] text-muted -mt-0.5">Premium Agricultural Co.</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'bg-ink text-cream'
                    : 'text-charcoal hover:bg-charcoal/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${
        mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6 pt-2 bg-cream/95 backdrop-blur-md space-y-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === link.to
                  ? 'bg-ink text-cream'
                  : 'text-charcoal hover:bg-charcoal/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
