import { useState, useCallback } from 'react';
import Habit from "../models/Habit";

function sortHabits(habits: Habit[]): Habit[] {
    return habits.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.completedValue - b.completedValue;
    });
}

export default function useSortedHabits(initialHabits: Habit[] = []) {
    const [habits, setHabitsInternal] = useState<Habit[]>(sortHabits([...initialHabits]));

    const setSortedHabits = useCallback((newHabits: Habit[] | ((prevHabits: Habit[]) => Habit[])) => {
      setHabitsInternal((prevHabits) => {
        const updatedHabits = typeof newHabits === 'function' ? newHabits(prevHabits) : newHabits;
        return sortHabits([...updatedHabits]);
      });
    }, []);
  
    return [habits, setSortedHabits] as const;
}