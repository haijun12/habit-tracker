import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    
    if (req.method === 'GET') {
      const user = await getUsers(userId)
      res.status(200).json({ message: 'Fetch users', user});
    } else if (req.method === 'POST') {
      // Handle POST request
      res.status(201).json({ message: `User created` });
    } else {
      // Handle unsupported method
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
async function getUsers(userId: string) {
    let user = await sql`SELECT * FROM users WHERE user_id = ${userId}`;
    if (user.rows.length === 0) {
      user = await sql`INSERT INTO users (user_id) VALUES (${userId}) RETURNING *`;
    }
    return user.rows[0];
}
