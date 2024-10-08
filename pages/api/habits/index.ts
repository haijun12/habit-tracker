import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres';
import Habit from '@/app/models/Habit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'POST') {
        try {
          const { newHabits } = req.body;
          
          console.log('Received Habits:', newHabits);

          newHabits.forEach(async (habit : Habit) => {
              await addHabit(habit, userId);
          });
          res.status(201).json({ message: 'Habits successfully updated!' });
        } catch (error) {
          console.error('Error parsing the request body:', error);
          res.status(400).json({ error: 'Invalid request body' });
        }
    }
    else if (req.method === 'GET') {
      try {
        const habits = await getHabits(userId);
        // console.log(habits)
        res.status(200).json(habits.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error('Error retrieving habits:', error);
        res.status(501).json({ error: 'Internal server error' });
      }
      res.status(200).json({ message: 'Habits successfully retrieved!' });
    } else if (req.method === 'DELETE') {
      try {
        const { habitId } = req.body;
        console.log("id is", habitId);
        const habitData = await sql`DELETE FROM habits WHERE habit_id = ${habitId} AND user_id = ${userId}`;
        console.log(habitData);
        res.status(200).json({ message: 'Habit successfully deleted!' });
      } catch (error) {
        console.error('Error deleting habit:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else if (req.method === 'PATCH') {
      const { updatedHabit } = req.body;
      console.log("updatedHabit", updatedHabit);
      if (!updatedHabit || !updatedHabit.id) {
          return res.status(400).json({ error: 'Invalid request' });
      }
      const { days, goal, unit, habitName, id } = updatedHabit;
      const boolString = days.map((b: string) => b.toString()).join(',');

      const entry = await sql`
          UPDATE habits
          SET weekly_schedule = ${boolString},
              target_value = ${goal},
              unit_of_measurement = ${unit},
              habit_name = ${habitName}
          WHERE habit_id = ${id}
          RETURNING *;
      `;

      res.status(200).json(entry.rows);
  } else {
      // Handle unsupported method
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

async function addHabit(habit: Habit, userId: string) {
    try {
      const habitId = await sql 
      `INSERT INTO habits (habit_name, weekly_schedule, user_id, target_value, unit_of_measurement) 
      VALUES 
      (${habit.habitName}, ${habit.days.join(',')}, ${userId}, ${habit.goal}, ${habit.unit}) RETURNING *`;

      return habitId.rows[0];

    } catch (error) {
      console.error("Error adding habit:", error);
      throw error; // Re-throw the error for proper handling in the calling code
    }
}

export async function getHabits(userId: string) {
  const habitData = await sql`SELECT * FROM habits WHERE user_id = ${userId}`;
  const habits : Habit[] = [];
  habitData.rows.forEach(habit => {
    habits.push(new Habit(habit.habit_name, parseInt(habit.target_value), habit.unit_of_measurement, habit.weekly_schedule.split(','), habit.habit_id));
  }); 
  return habits;
}