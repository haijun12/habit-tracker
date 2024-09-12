"use client";
import { useState, useEffect } from "react";
import MultiPageForm from "./AddHabitForm";
import { useUser } from '@clerk/nextjs';
import Habit from "../models/Habit";
import DateDisplay from "./DateDisplay";
import HabitList from "./HabitList";
import EditHabitForm from "./EditHabitForm";
import { useCallback } from "react";

export default function Habits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [addPopup, showAddPopup] = useState(false);
    const [editPopup, showEditPopup] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const addHabitPopup = () => showAddPopup(true);
    const closeAddHabitPopup = () => showAddPopup(false);

    const editHabitPopup = (habit: Habit) => {
      showEditPopup(true);
      setHabitToEdit(habit);
    };

    const closeEditHabitPopup = () => {
      showEditPopup(false);
      setHabitToEdit(null);
    };

    const date = new Date();
    const entryDate = date.toLocaleDateString('en-US');
    

    const getEntry = useCallback(async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/daily_habits?date=${encodeURIComponent(entryDate)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          setHabits(data);
        } catch (error) {
          console.error("Failed to fetch habits:", error);
        } finally {
          setIsLoading(false);
        }
      }, [habits, entryDate]);

      useEffect(() => {
        getEntry();
      }, []);

    return (
        <div className="flex flex-col h-screen p-4 m-auto max-w-xl relative overflow-auto">
            <Header addHabit={addHabitPopup} />
            <DateDisplay />
            {isLoading ? (
                <div> Loading Habits...</div>
            ) : (
                <>
                    {addPopup && (
                        <MultiPageForm closePopup={closeAddHabitPopup} habits={habits} setHabits={setHabits} />
                        )}
                    {editPopup && (
                        <EditHabitForm 
                            closePopup={closeEditHabitPopup} 
                            setHabits={setHabits} habits={habits} 
                            habitToEdit={habitToEdit} 
                        />
                        )}
                    <HabitList habits={habits} setHabits={setHabits} editHabit={editHabitPopup} />
                </>
            )}
        </div>
    );
}

function Header({ addHabit } : { addHabit: () => void }) {
    const { isLoaded, isSignedIn, user } = useUser();
    if (!isLoaded || !isSignedIn) {
        return null;
    }
    return (
        <div className="flex flex-row items-center justify-between">
            <h1 className="text-3xl">{user.username && user.username.charAt(0).toUpperCase() + user.username.slice(1)}&apos;s Habit Tracker</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={addHabit}
            >
                Add Habit
            </button>
        </div>
    );
}