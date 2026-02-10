import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-cream mb-3">Ungal Vivasaayi</h3>
            <p className="text-sm leading-relaxed text-cream/50 max-w-xs">
              Premium agricultural products crafted with care. Serving quality oils, lubricants, and farming essentials since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-cream/40 mb-4">Navigation</h4>
            <div className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/billing', label: 'Smart Billing' },
                { to: '/admin', label: 'Product Admin' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="block text-sm text-cream/60 hover:text-cream transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-cream/40 mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-cream/60">
              <p>Tamil Nadu, India</p>
              <p>info@ungalvivasaayi.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">
            &copy; {new Date().getFullYear()} Ungal Vivasaayi. All rights reserved.
          </p>
          <p className="text-xs text-cream/20">
            Crafted with precision
          </p>
        </div>
      </div>
    </footer>
  )
}
