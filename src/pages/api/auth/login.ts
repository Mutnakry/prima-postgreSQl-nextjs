import type { NextApiRequest, NextApiResponse } from 'next'
import { compare } from 'bcryptjs'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  const valid = await compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: 'Invalid password' })
  }

  // At this point, user is authenticated
  return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } })
}
