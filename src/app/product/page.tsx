
'use client'

import { useEffect, useState } from 'react'
import Navbar from "@/components/Navbar";

interface Product {
  id: string
  pro_name: string
  price: number
  discount?: number
  createdAt: string
  category?: { name: string }
  brand?: { name: string }
  categoryId?: string
  brandId?: string
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<any>({})
  const [editId, setEditId] = useState<string | null>(null)
  const [viewId, setViewId] = useState<string | null>(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [message, setMessage] = useState('')

  const isEditing = (id: string) => editId === id
  const isViewing = (id: string) => viewId === id

  useEffect(() => {
    fetchData()
    fetch('/api/categories').then(res => res.json()).then(setCategories)
    fetch('/api/brands').then(res => res.json()).then(setBrands)
  }, [])

  const fetchData = async () => {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      fetchData()
      setForm({})
      setMessage('✅ Product added!')
    }
  }

  const handleUpdate = async (id: string) => {
    const res = await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, id }),
    })
    if (res.ok) {
      fetchData()
      setEditId(null)
      setForm({})
      setMessage('✏️ Product updated!')
    }
  }

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this product?')
    if (!ok) return
    const res = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      fetchData()
      setMessage('🗑️ Product deleted!')
    }
  }

  const startEdit = (p: Product) => {
    setEditId(p.id)
    setForm({
      pro_name: p.pro_name,
      price: p.price,
      discount: p.discount || '',
      categoryId: p.categoryId,
      brandId: p.brandId || '',
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Navbar/>
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      {message && <p className="text-green-600 mb-3">{message}</p>}

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 border p-4 rounded">
        <input name="pro_name" required placeholder="Product Name" onChange={handleChange} className="border p-2 rounded" />
        <input name="price" required type="number" placeholder="Price" onChange={handleChange} className="border p-2 rounded" />
        <input name="discount" type="number" placeholder="Discount (%)" onChange={handleChange} className="border p-2 rounded" />
        <select name="categoryId" required onChange={handleChange} className="border p-2 rounded">
          <option value="">-- Select Category --</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="brandId" onChange={handleChange} className="border p-2 rounded">
          <option value="">-- Select Brand --</option>
          {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded col-span-1 md:col-span-2">Add Product</button>
      </form>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Discount</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border">Created</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="p-2 border">
                {isEditing(p.id) ? <input name="pro_name" value={form.pro_name} onChange={handleChange} className="w-full p-1 border" /> : p.pro_name}
              </td>
              <td className="p-2 border">
                {isEditing(p.id) ? <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full p-1 border" /> : `$${p.price.toFixed(2)}`}
              </td>
              <td className="p-2 border">
                {isEditing(p.id) ? <input name="discount" type="number" value={form.discount} onChange={handleChange} className="w-full p-1 border" /> : p.discount ?? '—'}
              </td>
              <td className="p-2 border">
                {isEditing(p.id) ? (
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full p-1 border">
                    <option value="">--</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                ) : (
                  p.category?.name ?? '—'
                )}
              </td>
              <td className="p-2 border">
                {isEditing(p.id) ? (
                  <select name="brandId" value={form.brandId} onChange={handleChange} className="w-full p-1 border">
                    <option value="">--</option>
                    {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                ) : (
                  p.brand?.name ?? '—'
                )}
              </td>
              <td className="p-2 border">{new Date(p.createdAt).toLocaleString()}</td>
              <td className="p-2 border text-center space-x-2">
                {isEditing(p.id) ? (
                  <>
                    <button onClick={() => handleUpdate(p.id)} className="text-green-600 text-xs">Save</button>
                    <button onClick={() => { setEditId(null); setForm({}) }} className="text-gray-500 text-xs">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(p)} className="text-blue-600 text-xs">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 text-xs">Delete</button>
                    <button onClick={() => setViewId(viewId === p.id ? null : p.id)} className="text-purple-600 text-xs">View</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewId && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2">Product Preview</h3>
          {products.filter(p => p.id === viewId).map(p => (
            <pre key={p.id} className="text-sm text-gray-700">{JSON.stringify(p, null, 2)}</pre>
          ))}
        </div>
      )}
    </div>
  )
}
