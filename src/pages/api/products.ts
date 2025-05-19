import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: List all products with category & brand
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        include: {
          category: true,
          brand: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      return res.status(200).json(products)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Failed to fetch products' })
    }
  }

  // POST: Create a new product
  if (req.method === 'POST') {
    const { pro_name, price, discount, categoryId, brandId } = req.body
    if (!pro_name || !price || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
      const product = await prisma.product.create({
        data: {
          pro_name,
          price: parseFloat(price),
          discount: discount ? parseFloat(discount) : undefined,
          categoryId,
          brandId,
        },
      })
      return res.status(201).json(product)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Failed to create product' })
    }
  }

  // PUT: Update a product (expects `id` in body)
  if (req.method === 'PUT') {
    const { id, pro_name, price, discount, categoryId, brandId } = req.body
    if (!id || !pro_name || !price || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
      const product = await prisma.product.update({
        where: { id },
        data: {
          pro_name,
          price: parseFloat(price),
          discount: discount ? parseFloat(discount) : undefined,
          categoryId,
          brandId,
        },
      })
      return res.status(200).json(product)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Failed to update product' })
    }
  }

  // DELETE: Delete a product (expects `id` in body)
  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'Missing product ID' })

    try {
      await prisma.product.delete({ where: { id } })
      return res.status(200).json({ message: 'Product deleted' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Failed to delete product' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
