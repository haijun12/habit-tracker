import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    
    if (req.method === 'GET') {
      // Handle GET request
      res.status(200).json({ message: 'Fetch users', userId});
    } else if (req.method === 'POST') {
      // Handle POST request
      const { name, email } = req.body;
      res.status(201).json({ message: `User ${name} created` });
    } else {
      // Handle unsupported method
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }