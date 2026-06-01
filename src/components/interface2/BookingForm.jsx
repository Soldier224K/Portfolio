import { useState } from 'react'
import api from '../../utils/api'

export default function BookingForm() {
  const [status, setStatus] = useState('idle') // idle, submitting, success, error
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', requestType: 'consult', preferredDate: '', message: ''
  })

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      await api.post('/bookings', formData)
      setStatus('success')
      setFormData({ name: '', email: '', company: '', requestType: 'consult', preferredDate: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Name *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Email *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Company</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Date</label>
          <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-2">I want to...</label>
        <select name="requestType" value={formData.requestType} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors appearance-none">
          <option value="consult">Book a Consultation</option>
          <option value="hire">Discuss Full-Time Role</option>
          <option value="collaborate">Collaborate on a Project</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Message</label>
        <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors"></textarea>
      </div>

      <button disabled={status === 'submitting'} type="submit" className="w-full py-4 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50">
        {status === 'submitting' ? 'SENDING...' : 'REQUEST BOOKING'}
      </button>

      {status === 'success' && <p className="text-green-400 text-center text-sm">Booking request sent successfully. I will be in touch shortly.</p>}
      {status === 'error' && <p className="text-red-400 text-center text-sm">Failed to send request. Please try again later.</p>}
    </form>
  )
}
