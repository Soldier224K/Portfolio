import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import { useDashboardStore } from '../../stores/dashboardStore'

export default function DocumentDepot() {
  const docs = useDashboardStore(state => state.documents)
  const setDocs = useDashboardStore(state => state.setDocuments)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchDocs = () => {
    setLoading(true)
    api.get('/documents')
      .then(res => setDocs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => fetchDocs(), [])

  const handleUpload = async (e) => {
    if (!e.target.files[0]) return
    const formData = new FormData()
    formData.append('document', e.target.files[0])
    
    setUploading(true)
    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      fetchDocs()
    } catch (err) {
      alert('UPLOAD_FAILED')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('CONFIRM_DELETION?')) return
    try {
      await api.delete(`/documents/${id}`)
      setDocs(docs.filter(d => d._id !== id))
    } catch {
      alert('DELETE_FAILED')
    }
  }

  const handleDownload = async (id, filename) => {
    try {
      const res = await api.get(`/documents/${id}`)
      alert(`DOWNLOADED: ${filename} (Size: ${res.data.length})`)
    } catch {
      alert('DOWNLOAD_FAILED')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <h3 className="text-[var(--accent)] text-xl font-bold tracking-widest">DOCUMENT_DEPOT</h3>
        
        <label className="cursor-pointer px-4 py-2 border border-[var(--accent)] text-[var(--accent)] text-sm hover:bg-[var(--accent)] hover:text-black transition-colors relative">
          {uploading ? 'UPLOADING...' : '+ UPLOAD_FILE'}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="text-[var(--accent)] animate-pulse">RETRIEVING DATA_</div>
      ) : docs.length === 0 ? (
        <div className="text-[var(--text-secondary)] border border-dashed border-[var(--border)] p-12 text-center">
          NO DOCUMENTS FOUND IN DEPOT.
        </div>
      ) : (
        <div className="grid gap-2">
          {docs.map((doc, i) => (
            <motion.div 
              key={doc._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col md:flex-row justify-between md:items-center p-3 border border-[var(--border)] bg-black/40 hover:bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors group gap-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-[var(--text-secondary)]">📄</span>
                <span className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">{doc.filenameDecrypted || 'encrypted_file.dat'}</span>
                <span className="text-[10px] text-[var(--text-secondary)] hidden sm:inline">{(doc.fileSize / 1024).toFixed(1)} KB</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--text-secondary)] mr-4 hidden md:inline">
                  {new Date(doc.createdAt).toISOString().split('T')[0]}
                </span>
                <button onClick={() => handleDownload(doc._id, doc.filenameDecrypted)} className="px-2 py-1 border border-[var(--accent)] text-[var(--accent)] text-xs font-bold hover:bg-[var(--accent)] hover:text-black transition-colors">
                  DL
                </button>
                <button onClick={() => handleDelete(doc._id)} className="px-2 py-1 border border-[var(--warning)] text-[var(--warning)] text-xs font-bold hover:bg-[var(--warning)] hover:text-black transition-colors">
                  DEL
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
