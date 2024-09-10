import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres';
import Habit from '@/app/models/Habit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    if (req.method === 'GET') {
        const date = new Date();
        const formattedDate = DateFormat(date);

        console.log(formattedDate);
        res.status(200).json({ date: formattedDate });

    }
}

function DateFormat(date: Date | null) {
    if (!date) {
        return 'Loading...';
    }
    let period = "am";
    let hours = date.getHours().toString().padStart(2, '0');
    if (parseInt(hours) > 12) {
        hours = String(parseInt(hours) - 12);
        period = "pm";
    }
    
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year} | ${dayOfWeek} ${hours}:${minutes} ${period}`;
}