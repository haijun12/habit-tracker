import Habit from "../models/Habit";
import { useState, useCallback } from "react";

export function updateEntry(updatedHabit : Habit) {
    fetch(`/api/daily_habits`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({updatedHabit}),
    })
}

export async function getEntries(currDate: Date) {
    return await fetch(`/api/daily_habits?date=${encodeURIComponent(currDate.toLocaleDateString('en-US'))}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });
}