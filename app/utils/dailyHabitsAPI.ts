import Habit from "../models/Habit";

export function updateEntry(updatedHabit : Habit) {
    console.log("updatedHabit", updatedHabit);
    fetch(`/api/daily_habits`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({updatedHabit}),
    })
}