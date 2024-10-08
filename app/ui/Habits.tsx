"use client";
import { useState, useEffect } from "react";
import MultiPageForm from "./AddHabitForm";
import { useUser } from '@clerk/nextjs';
import Habit from "../models/Habit";
import DateDisplay from "./DateDisplay";
import HabitList from "./HabitList";
import EditHabitForm from "./EditHabitForm";
import { useCallback } from "react";
import Statistics from "./Statistics";
import useSortedHabits from "../hooks/useSortedHabits";
import Timer from "./Timer";
import { updateEntry, getEntries } from "../utils/dailyHabitsAPI";

export default function Habits() {
    const [habits, setHabits] = useSortedHabits();
    const [addPopup, showAddPopup] = useState(false);
    const [editPopup, setEditPopup] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currDate, setCurrDate] = useState(new Date());
    const [currDayOfWeek, setCurrDayOfWeek] = useState(new Date().getDay());


    const addHabitPopup = () => showAddPopup(!addPopup);

    const togglePopup = (popupType: 'timer' | 'edit', habit?: Habit) => {
        if (popupType === 'timer') {
            setShowTimer(!!habit);
        } else if (popupType === 'edit') {
            setEditPopup(!!habit);
        }
        
        setHabitToEdit(habit || null);
    }

    function updateHabit(updatedHabit: Habit) {
        setHabits(habits.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
        updateEntry(updatedHabit, "daily_habits");
    }

    const getEntry = useCallback(async () => {
        setIsLoading(true);
        try {
          const response = await getEntries(currDate, currDayOfWeek);
          const data = await response.json();
          setHabits(data);
        } catch (error) {
          console.error("Failed to fetch habits:", error);
        } finally {
          setIsLoading(false);
        }
      }, [habits, currDate]);

    useEffect(() => {
        getEntry();
    }, [currDate]);

    useEffect(() => {
        console.log(showTimer);
    }, [showTimer]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 h-screen">

        <div className="col-span-full lg:col-start-3 lg:col-span-2 h-full p-4 m-auto w-full relative">
            <Header addHabit={addHabitPopup} />
            <DateDisplay CurrDate={currDate} setCurrDate={setCurrDate} setCurrDayOfWeek={setCurrDayOfWeek} />
            {isLoading ? (
                <div> Loading Habits...</div>
                ) : (
                    <>
                    {addPopup && (
                        <MultiPageForm closePopup={addHabitPopup} habits={habits} setHabits={setHabits} />
                        )}
                    {showTimer && (
                        <Timer 
                        closePopup={() => togglePopup('timer')}
                        habitToEdit={habitToEdit}
                        updateHabit={updateHabit}
                        />
                        )}
                    {editPopup && (
                        <EditHabitForm 
                        closePopup={() => togglePopup('edit')}
                        setHabits={setHabits} habits={habits} 
                        habitToEdit={habitToEdit} 
                        />
                        )}
                    <HabitList 
                        habits={habits} 
                        setHabits={setHabits} 
                        showEditPopup={(habit) => togglePopup('edit', habit)} 
                        showTimerPopup={(habit) => togglePopup('timer', habit)}/>
                </>
            )}
        </div>
        {isLoading ? (
            <div> Loading Stats...</div>
        ) : (
            <div className="col-span-full lg:col-start-5 lg:col-span-2 p-4">
                <Statistics habits={habits} />
            </div>
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

            <h1 className="text-2xl md:text-3xl font-bold">{user.username && user.username.charAt(0).toUpperCase() + user.username.slice(1)}&apos;s Habits</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-slate-500"
                onClick={addHabit}
            >
                Add Habit
            </button>
        </div>
    );
}