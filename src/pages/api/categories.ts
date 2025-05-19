import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: fetch all categories
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return res.status(200).json(categories)
    } catch (error) {
      console.error('GET error:', error)
      return res.status(500).json({ message: 'Failed to fetch categories' })
    }
  }

  // POST: create new category
  if (req.method === 'POST') {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })

    try {
      const category = await prisma.category.create({ data: { name } })
      return res.status(201).json(category)
    } catch (error) {
      console.error('POST error:', error)
      return res.status(500).json({ message: 'Failed to create category' })
    }
  }

  // PUT: update category
  if (req.method === 'PUT') {
    const { id, name } = req.body
    if (!id || !name) return res.status(400).json({ message: 'Missing id or name' })

    try {
      const category = await prisma.category.update({
        where: { id },
        data: { name },
      })
      return res.status(200).json(category)
    } catch (error) {
      console.error('PUT error:', error)
      return res.status(500).json({ message: 'Failed to update category' })
    }
  }

  // DELETE: delete category
if (req.method === 'DELETE') {
  const { id } = req.body
  if (!id) return res.status(400).json({ message: 'Missing category ID' })

  try {
    await prisma.category.delete({ where: { id } })
    return res.status(200).json({ message: 'Category deleted' }
      
    )
  } catch (error) {
    console.error('DELETE error:', error)
    return res.status(500).json({ message: 'Failed to delete category' })
  }
}


  return res.status(405).json({ message: 'Method not allowed' })
}
