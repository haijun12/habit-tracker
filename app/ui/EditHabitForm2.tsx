import React, { useState } from "react";
import Habit from "../models/Habit";
import { updateEntry } from "../utils/dailyHabitsAPI";
import XButton from "./XButton";
import Input from "./Input";

interface FormProps {
    closePopup: () => void;
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    habits: Habit[];
    habitToEdit: Habit | null;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function EditHabitForm2({closePopup, setHabits, habits, habitToEdit} : FormProps) {
    const [goal, setGoal] = useState(habitToEdit?.goal || 0);
    const [unit, setUnit] = useState(habitToEdit?.unit || "");
    const [habitName, setHabitName] = useState(habitToEdit?.habitName || "");
    const [days, setDays] = useState(Array(7).fill("true"));
    const [editing, setEditing] = useState(false);

    if (!habitToEdit) {
        return null;
    }
    const originalAmount = habitToEdit.completedValue;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!habitToEdit) return;
        const updatedHabit = {
            ...habitToEdit,
            goal: goal,
            unit: unit,
            habitName: habitName,
            days: days
        };
        updateEntry(updatedHabit, "habits");
        setHabits(habits.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
        closePopup();
    }

    function deleteHabit(habitId : number) {
        fetch(`/api/habits/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ habitId }),
        })
        .then(response => response.json())
        .then(data => console.log(data));
        setHabits(habits.filter(habit => habit.id !== habitId));
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
            <div className="bg-white p-16 rounded shadow-lg relative w-96 md:w-1/3 ">
                <XButton closePopup={closePopup} />
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4">Edit {habitName}</h2>
                    {editing ? (
                        <div className="mb-4">
                            <Input label="habitName" type="string" value={habitName} onChange={(e) => setHabitName(e.target.value)} placeholder="Enter an name!" />
                            for <Input label="goal" type="number" value={goal} onChange={(e) => setGoal(parseInt(e.target.value))} placeholder="Enter a goal!" />
                            <Input label="unit" type="string" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Enter a unit!" /> 
                            <div className="grid grid-cols-4 md:flex md:flex-row justify-left my-4">

                                {daysOfWeek.map((day, i) => (
                                    <button
                                    type="button"
                                    key={day}
                                    className={`w-12 h-10 p-2 border-2 rounded-full mr-2 ${
                                        days[i] === "true"? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-800 border-gray-300"
                                    } hover:bg-blue-200 transition-colors`}
                                    onClick={() => setDays(days.map((d : string, idx: number) => i === idx ? d === "true" ? "false" : "true" : d))}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="completedAmount">
                                {habitName} for {goal} {unit}
                            </label>
                        </div>
                     ) }
                    <button
                        type="button"
                        onClick= {() => setEditing(!editing)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-slate-500"
                    >
                        Click to {editing ? "View" : "Edit"}
                    </button>
                    <button
                        type="submit"
                        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-slate-500"
                    >
                        Submit
                    </button>
                    <button className="absolute top-2 left-2 text-red-500 px-4 py-2 rounded hover:bg-slate-100" 
                            onClick={() => deleteHabit(habitToEdit.id)}
                    >
                       <i className="fa-solid fa-trash"></i>
                    </button>
                </form>
            </div>
        </div>
    )
}