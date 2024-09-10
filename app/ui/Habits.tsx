"use client";
import Checkbox from "./Checkbox";
import { useState, useEffect } from "react";
import MultiPageForm from "./MultiPageForm";
import { useUser } from '@clerk/nextjs';
import Habit from "../models/Habit";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Button from '@mui/material/Button';

export default function Habits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [popup, showPopup] = useState(false);
    const [date, setDate] = useState<string>('');

    const addHabit = () => showPopup(true);
    const closePopup = () => showPopup(false);

    async function getHabits() {
        const response = await fetch('/api/habits');
        const data = await response.json();
        setHabits(data);
    }

    async function getDate() {
        const response = await fetch('/api/habit_entries');
        const data = await response.json();
        setDate(data.date);
    }

    useEffect(() => {
        getHabits();
        getDate();
        console.log(habits);
        console.log(date);
    }, []);

    useEffect(() => {
        console.log(habits);
    }, [habits]);

    function deleteHabit(id: number) {
        fetch(`/api/habits/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
        .then(response => response.json())
        .then(data => console.log(data));
        setHabits(habits.filter(habit => habit.id !== id));
    }

    return (
        <div className="flex flex-col h-screen p-4 m-auto max-w-xl relative overflow-auto">
            {date && <div>{date}</div>}
            <Header addHabit={addHabit} />

            {popup && (
                <MultiPageForm closePopup={closePopup} habits={habits} setHabits={setHabits} />
            )}

            <HabitList habits={habits} deleteHabit={deleteHabit} />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar />
            </LocalizationProvider> */}
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
            <h1 className="text-3xl">{user.username}&apos;s Habit Tracker</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={addHabit}
            >
                Add Habit
            </button>
        </div>
    );
}

function HabitList({ habits, deleteHabit } : { habits: Habit[], deleteHabit: (id: number) => void }) {
    let totalTime = 0;
    return (
        <>
          <div className="my-8">
              {habits.map((habit, index) => {
                habit.unit === "minutes" ? totalTime += habit.goal : 0;
                return <HabitItem key={index} habit={habit} deleteHabit={deleteHabit} />
              })}
          </div>
          <div> Total Time: {totalTime} minutes</div>
        </>
    );
}

function HabitItem({ habit, deleteHabit } : { habit: Habit, deleteHabit: (id: number) => void }) {
    return (
        <div className="flex flex-row items-center text-lg mb-4">
            <Checkbox />
            <div className="flex flex-row items-center justify-between w-full">
                <HabitDetails habit={habit} deleteHabit={deleteHabit} />
            </div>
        </div>
    );
}

function HabitDetails({ habit, deleteHabit } : { habit: Habit, deleteHabit: (id: number) => void }) {
    return (
        <>
            <div className="flex flex-col px-4">
                <div>{habit.habitName}</div>
                <div>{habit.goal} {habit.unit}</div>
            </div>
            <div className="flex flex-row">
                <Button className="text-slate-500">Log</Button>
                <Button className="text-slate-500">Timer</Button>
                <Button className="text-slate-500"> Edit</Button>
                <Button className="text-slate-500" onClick={() => deleteHabit(habit.id)}>Delete</Button>
            </div>
        </>
    );
}
