import Habit from "../models/Habit";

export function updateEntry(updatedHabit : Habit) {
    fetch(`/api/daily_habits`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({updatedHabit}),
    })
}

export async function getEntries(currDate: Date, currDayOfWeek: number) {
    return await fetch(`/api/daily_habits?date=${encodeURIComponent(currDate.toLocaleDateString('en-US'))}&day=${currDayOfWeek}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });
}