'use client'

import { useEffect, useState } from 'react'

interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export default function CategoryForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({ name: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [viewId, setViewId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ name: '' })
      setMessage('✅ Category added')
      fetchCategories()
    }
  }

  const startEdit = (category: Category) => {
    setEditId(category.id)
    setForm({ name: category.name })
  }

  const cancelEdit = () => {
    setEditId(null)
    setForm({ name: '' })
  }

  const handleUpdate = async (id: string) => {
    const res = await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form }),
    })
    if (res.ok) {
      setEditId(null)
      setForm({ name: '' })
      setMessage('✏️ Category updated!')
      fetchCategories()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    const res = await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setMessage('🗑️ Category deleted')
      fetchCategories()
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">All Categories</h1>
      {message && <p className="text-green-600 mb-3">{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="w-full border text-sm mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Updated At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="p-2 border">
                  {editId === cat.id ? (
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full p-1 border"
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="p-2 border">{new Date(cat.createdAt).toLocaleString()}</td>
                <td className="p-2 border">{new Date(cat.updatedAt).toLocaleString()}</td>
                <td className="p-2 border text-center space-x-2">
                  {editId === cat.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        className="text-green-600 text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-600 text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(cat)}
                        className="text-blue-600 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 text-xs"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setViewId(viewId === cat.id ? null : cat.id)}
                        className="text-purple-600 text-xs"
                      >
                        View
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {viewId && (
        <div className="p-4 mb-6 border bg-gray-50 text-sm">
          <h3 className="font-bold mb-1">Category Preview</h3>
          <pre>{JSON.stringify(categories.find(c => c.id === viewId), null, 2)}</pre>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto p-4 border rounded"
      >
        <h1 className="text-lg font-bold mb-3">Add Category</h1>
        <input
          type="text"
          name="name"
          placeholder="Category name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>
    </div>
  )
}
