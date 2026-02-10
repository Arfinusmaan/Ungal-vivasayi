import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function Invoice() {
  const navigate = useNavigate()
  const invoiceRef = useRef(null)
  const [invoice, setInvoice] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('uv_current_invoice')
    if (data) {
      setInvoice(JSON.parse(data))
    } else {
      navigate('/billing')
    }
  }, [navigate])

  const downloadPDF = async () => {
    if (!invoiceRef.current || generating) return
    setGenerating(true)

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`UV-Invoice-${invoice.invoiceNumber}.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setGenerating(false)
    }
  }

  if (!invoice) return null

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 no-print">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-muted">Invoice Preview</span>
            <h1 className="font-serif text-3xl text-ink mt-1">Invoice #{invoice.invoiceNumber}</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/billing')}
              className="px-5 py-2.5 rounded-xl bg-cream text-charcoal text-sm font-medium hover:bg-charcoal/5 transition-colors"
            >
              New Invoice
            </button>
            <button
              onClick={downloadPDF}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <path d="M7 10l5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
              {generating ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Invoice Document */}
        <div className="bg-white rounded-2xl shadow-xl shadow-charcoal/5 overflow-hidden border border-charcoal/5">
          <div ref={invoiceRef} className="p-8 sm:p-12" style={{ backgroundColor: '#ffffff' }}>
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-[#5d6d53] flex items-center justify-center shadow-lg shadow-[#5d6d53]/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-.3 4.3-.9" />
                    <path d="M7 12c0-3 2-6 5-8" />
                    <path d="M12 22c3-2 5-5 5-8" />
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#0a0a0a', margin: '0 0 4px 0', lineHeight: 1 }}>
                    Ungal Vivasaayi
                  </h2>
                  <p style={{ fontSize: '10px', color: '#737373', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0, fontWeight: 700 }}>
                    Premium Agricultural Works
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p style={{ fontSize: '12px', color: '#0a0a0a', fontWeight: 600, margin: '0 0 4px 0' }}>Ungal Vivasaayi HQ</p>
                <p style={{ fontSize: '11px', color: '#737373', lineHeight: 1.6, margin: 0 }}>
                  12/48 Green Valley, Pollachi<br />
                  Tamil Nadu — 642001<br />
                  GSTIN: 33AABCV1234F1Z5
                </p>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <p style={{ fontSize: '10px', color: '#737373', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>
                  Recipient
                </p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 4px 0', fontFamily: "'Playfair Display', serif" }}>
                  {invoice.customer.name}
                </p>
                {invoice.customer.phone && (
                  <p style={{ fontSize: '12px', color: '#737373', margin: 0 }}>{invoice.customer.phone}</p>
                )}
                <p style={{ fontSize: '11px', color: '#737373', marginTop: '4px' }}>Tamil Nadu, India</p>
              </div>
              <div className="text-right">
                <p style={{ fontSize: '10px', color: '#737373', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>
                  Invoice Details
                </p>
                <div style={{ display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '8px 24px', textAlign: 'left' }}>
                  <span style={{ fontSize: '12px', color: '#737373' }}>Invoice No</span>
                  <span style={{ fontSize: '12px', color: '#0a0a0a', fontWeight: 600 }}>#UV-{invoice.invoiceNumber}</span>
                  <span style={{ fontSize: '12px', color: '#737373' }}>Date</span>
                  <span style={{ fontSize: '12px', color: '#0a0a0a', fontWeight: 600 }}>{invoice.date}</span>
                  <span style={{ fontSize: '12px', color: '#737373' }}>Status</span>
                  <span style={{ fontSize: '10px', color: '#5d6d53', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: '#e8ede4', padding: '2px 8px', borderRadius: '4px' }}>Paid</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-10">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #0a0a0a' }}>
                    <th style={{ textAlign: 'left', padding: '16px 0', fontSize: '10px', color: '#737373', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                      Description
                    </th>
                    <th style={{ textAlign: 'center', padding: '16px 0', fontSize: '10px', color: '#737373', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                      Qty
                    </th>
                    <th style={{ textAlign: 'right', padding: '16px 0', fontSize: '10px', color: '#737373', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                      Rate
                    </th>
                    <th style={{ textAlign: 'right', padding: '16px 0', fontSize: '10px', color: '#737373', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f2f2f2' }}>
                      <td style={{ padding: '20px 0' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 4px 0', fontFamily: "'Playfair Display', serif" }}>{item.name}</p>
                        <p style={{ fontSize: '10px', color: '#737373', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.unit} &bull; {item.category}</p>
                      </td>
                      <td style={{ textAlign: 'center', fontSize: '13px', color: '#0a0a0a', padding: '20px 0', fontWeight: 500 }}>
                        {item.qty}
                      </td>
                      <td style={{ textAlign: 'right', fontSize: '13px', color: '#0a0a0a', padding: '20px 0', fontWeight: 500 }}>
                        &#8377;{item.price}
                      </td>
                      <td style={{ textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#0a0a0a', padding: '20px 0' }}>
                        &#8377;{(item.price * item.qty).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div style={{ width: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '13px' }}>
                  <span style={{ color: '#737373' }}>Subtotal</span>
                  <span style={{ color: '#0a0a0a', fontWeight: 600 }}>&#8377;{invoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '13px', borderBottom: '1px solid #f2f2f2' }}>
                  <span style={{ color: '#737373' }}>GST (5%)</span>
                  <span style={{ color: '#0a0a0a', fontWeight: 600 }}>&#8377;{invoice.tax.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0a0a0a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Amount</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#0a0a0a', fontWeight: 700 }}>
                    &#8377;{invoice.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-10 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p style={{ fontSize: '10px', color: '#737373', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Notes</p>
                  <p style={{ fontSize: '11px', color: '#737373', lineHeight: 1.6 }}>
                    This is a computer generated invoice. No signature required. 
                    All products are certified for quality and purity.
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '10px', color: '#737373', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Contact</p>
                  <p style={{ fontSize: '11px', color: '#737373', lineHeight: 1.6 }}>
                    support@ungalvivasaayi.com<br />
                    +91 98765 43210
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '10px', color: '#d1d1d1', textAlign: 'center', marginTop: '40px', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
                Tradition Meets Excellence
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
