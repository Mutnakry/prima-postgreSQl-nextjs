import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET — List all brands
  if (req.method === 'GET') {
    try {
      const brands = await prisma.brand.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(brands)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Failed to fetch brands' })
    }
  }

  // POST — Create a new brand
  if (req.method === 'POST') {
    const { name, logo } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })

    try {
      const brand = await prisma.brand.create({ data: { name, logo } })
      return res.status(201).json(brand)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Failed to create brand' })
    }
  }

  // PUT — Update an existing brand
  if (req.method === 'PUT') {
    const { id, name, logo } = req.body
    if (!id || !name) return res.status(400).json({ message: 'ID and name are required' })

    try {
      const brand = await prisma.brand.update({
        where: { id },
        data: { name, logo },
      })
      return res.status(200).json(brand)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Failed to update brand' })
    }
  }

  // DELETE — Delete a brand
  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'ID is required' })

    try {
      await prisma.brand.delete({ where: { id } })
      return res.status(200).json({ message: 'Brand deleted successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Failed to delete brand' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
