import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres';
import Habit from '@/app/models/Habit';
import { getHabits } from '@/pages/api/habits';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    if (req.method === 'GET') {
        const { date, day } = req.query;
        if (typeof date !== 'string' || typeof day !== 'string') {
            return res.status(400).json({ error: 'Invalid date' });
        }
        const entries = await getDailyHabits(userId, date, parseInt(day));
        res.status(200).json(entries);
    } else if (req.method === 'PATCH') {
        const { updatedHabit } = req.body;
        console.log("updatedHabit", updatedHabit);
        if (!updatedHabit || !updatedHabit.entryId) {
            return res.status(400).json({ error: 'Invalid request' });
        }
        const { entryId, completed, completedValue, notes } = updatedHabit;
        const entry = await sql`
            UPDATE habit_entries
            SET completed = ${completed ? 1 : 0},
                completed_value = ${completedValue},
                notes = ${notes}
            WHERE entry_id = ${entryId}
            RETURNING *;
        `;

        res.status(200).json(entry.rows);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

async function getDailyHabits(userId: string, date: string, day: number) {
    const habits = await getHabits(userId);
    // console.log(habits);
    const filteredHabits = habits.filter(habit => habit.days[day] !== true);
    console.log(filteredHabits);
    const entriesQuery = await sql`
        SELECT * FROM habit_entries
        WHERE user_id = ${userId} 
        AND entry_date = ${date}
    `;
    const entries = entriesQuery.rows;

    const dailyHabits = await Promise.all(filteredHabits.map(async (habit) => {
        const entry = entries.find(e => e.habit_id === habit.id) || await addHabitEntry(habit, userId, date);
        const habitObject = new Habit(
            habit.habitName,
            habit.goal,
            habit.unit,
            habit.days,
            habit.id,  
            entry.entry_id,  
            entry.entry_date, 
            entry.completed,
            entry.notes,
            entry.completed_value
        );

        return habitObject;
    }));
    return dailyHabits;
}

async function addHabitEntry(habit: Habit, userId: string, date: string, completed_value: number = 0, notes: string = '') {
    try {
        const entryId = await sql `
            INSERT INTO habit_entries (habit_id, entry_date, completed_value, user_id, notes)
            VALUES (${habit.id}, ${date}, ${completed_value}, ${userId}, ${notes}) 
            RETURNING *
        `;

      return entryId.rows[0];

    } catch (error) {
      console.error("Error adding habit entry:", error);
      throw error;
    }
}

