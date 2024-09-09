"use client";
import Checkbox from "./Checkbox";
import { useState, useEffect } from "react";
import MultiPageForm from "./MultiPageForm";
import { useUser } from '@clerk/nextjs'

export default function Habits() {
  const [habits, setHabits] = useState<any[]>([]);
  const [popup, showPopup] = useState(false);

  const addHabit = () => showPopup(true);
  const closePopup = () => showPopup(false);

  function getHabits() {
    fetch('/api/users')
    .then(response => response.json())
    .then(data => console.log(data));
  }

  useEffect(() => {
    getHabits();
  }, []);


  return (
    <div className="flex flex-col h-screen p-4 m-auto max-w-xl">
      <Header addHabit={addHabit} />
      
      {popup && (
        <MultiPageForm closePopup={closePopup} habits={habits} setHabits={setHabits} />
      )}
      
      <HabitList habits={habits} />
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
        <h1 className="text-3xl">{user.username}'s Habit Tracker</h1>
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={addHabit}
        >
            Add Habit
        </button>
        </div>
    );
}

function HabitList({ habits } : { habits: any[] }) {
    return (
        <div className="my-16">
        {habits.map((habit, index) => (
            <HabitItem key={index} habit={habit} />
        ))}
        </div>
    );
}
function HabitItem({ habit } : { habit: any[] }) {
    return (
        <div className="flex flex-row items-center text-lg">
        <Checkbox />
        <div className="flex flex-row items-center justify-between w-full">
            <HabitDetails habit={habit} />
            <HabitActions />
        </div>
        </div>
    );
}
function HabitDetails({ habit } : { habit: any[] }) {
    alert(habit[0]);
    return (
        <div className="flex flex-col px-4">
            <div>{habit.habitName}</div>
            <div>{habit.goal} Minutes</div>
        </div>
    );
}
function HabitActions() {
    return (
        <div className="flex flex-row">
            <div className="px-4">Log Time</div>
            <div>Timer</div>
        </div>
    );
}  