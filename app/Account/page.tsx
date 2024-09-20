"use client";
import React, { useState, useEffect } from "react";
import Habit from "../models/Habit";
import Link from "next/link";
import EditHabitForm2 from "../ui/EditHabitForm2";

export default function AccountView() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [editPopup, setEditPopup] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

    const togglePopup = (habit?: Habit) => {
        setEditPopup(!!habit);
        setHabitToEdit(habit || null);

    }

    async function getHabits() {
        await fetch('/api/habits')
        .then(response => response.json())
        .then(data => {console.log("data",data); setHabits(data)});
    }

    useEffect(() => {
        getHabits();
    }, []);
    
    return (
        <div className="flex justify-center min-h-screen">
            <div className="w-full max-w-md p-6">
                {editPopup && (
                    <EditHabitForm2
                    closePopup={() => togglePopup()} 
                    setHabits={setHabits} 
                    habits={habits} 
                    habitToEdit={habitToEdit} 
                    />
                )}
                <h1 className="text-4xl font-bold mb-6 text-center">Account View</h1>
                <Link href="/">
                    Back to Entries
                </Link>
                {habits.map(habit => (
                    <div key={habit.id} className="flex items-center justify-between mb-4 w-full">
                        <div>{habit.habitName}</div>
                        <button className="px-4 py-2 rounded hover:bg-slate-100 text-slate-500" 
                            onClick={() => togglePopup(habit)}
                        >
                        <i className="fa-solid fa-pen-to-square text-slate-500 cursor-pointer hover:text-slate-700"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}