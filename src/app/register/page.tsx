'use client'

import { useState } from 'react'

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

  const res = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
})

    const data = await res.json()
    if (res.ok) {
      setMessage('User registered successfully!')
    } else {
      setError(data.message || 'Registration failed.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input type="text" name="first_name" placeholder="First Name" className="w-full mb-2 p-2 border rounded" onChange={handleChange} />
      <input type="text" name="last_name" placeholder="Last Name" className="w-full mb-2 p-2 border rounded" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  )
}
