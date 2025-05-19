import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { email, password, first_name, last_name } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) {
      return res.status(409).json({ message: 'User already exists.' })
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
      },
    })

    return res.status(201).json({ message: 'User created successfully!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong.' })
  }
}
