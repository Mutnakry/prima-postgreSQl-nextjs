'use client'

import { useEffect, useState } from 'react'

interface Brand {
  id: string
  name: string
  logo?: string
  createdAt: string
  updatedAt: string
}

export default function BrandForm() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [form, setForm] = useState({ name: '', logo: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [viewId, setViewId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    setLoading(true)
    const res = await fetch('/api/brands')
    const data = await res.json()
    setBrands(data)
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ name: '', logo: '' })
      setMessage('✅ Brand added!')
      fetchBrands()
    }
  }

  const startEdit = (brand: Brand) => {
    setEditId(brand.id)
    setForm({ name: brand.name, logo: brand.logo || '' })
  }

  const cancelEdit = () => {
    setEditId(null)
    setForm({ name: '', logo: '' })
  }

  const handleUpdate = async (id: string) => {
    const res = await fetch('/api/brands', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form }),
    })
    if (res.ok) {
      setEditId(null)
      setForm({ name: '', logo: '' })
      setMessage('✏️ Brand updated!')
      fetchBrands()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure to delete this brand?')) return
    const res = await fetch('/api/brands', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setMessage('🗑️ Brand deleted')
      fetchBrands()
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">All Brands</h1>
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : brands.length === 0 ? (
        <p>No brands found.</p>
      ) : (
        <table className="w-full border text-sm mb-10">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Logo</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id}>
                <td className="p-2 border">
                  {editId === b.id ? (
                    <input name="name" value={form.name} onChange={handleChange} className="w-full p-1 border" />
                  ) : (
                    b.name
                  )}
                </td>
                <td className="p-2 border">
                  {editId === b.id ? (
                    <input name="logo" value={form.logo} onChange={handleChange} className="w-full p-1 border" />
                  ) : b.logo ? (
                    <img src={b.logo} alt={b.name} className="h-6" />
                  ) : (
                    <span className="text-gray-400 italic">No logo</span>
                  )}
                </td>
                <td className="p-2 border">{new Date(b.createdAt).toLocaleString()}</td>
                <td className="p-2 border text-center space-x-2">
                  {editId === b.id ? (
                    <>
                      <button onClick={() => handleUpdate(b.id)} className="text-green-600 text-xs">Save</button>
                      <button onClick={cancelEdit} className="text-gray-600 text-xs">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(b)} className="text-blue-600 text-xs">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="text-red-600 text-xs">Delete</button>
                      <button onClick={() => setViewId(viewId === b.id ? null : b.id)} className="text-purple-600 text-xs">View</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {viewId && (
        <div className="border p-4 bg-gray-50 text-sm mb-6">
          <h3 className="font-bold mb-2">Brand Info</h3>
          <pre>{JSON.stringify(brands.find(b => b.id === viewId), null, 2)}</pre>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 border rounded">
        <h1 className="text-lg font-bold mb-3">Add Brand</h1>
        <input
          type="text"
          placeholder="Brand name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Logo URL (optional)"
          name="logo"
          value={form.logo}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
      </form>
    </div>
  )
}
