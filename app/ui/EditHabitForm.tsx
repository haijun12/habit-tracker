import React, { useState } from "react";
import Habit from "../models/Habit";
import { updateEntry } from "../utils/dailyHabitsAPI";
import XButton from "./XButton";

interface FormProps {
    closePopup: () => void;
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    habits: Habit[];
    habitToEdit: Habit | null;
}

export default function EditHabitForm({closePopup, setHabits, habits, habitToEdit} : FormProps) {
    const [completedAmount, setCompletedAmount] = useState("0");
    const [notes, setNotes] = useState(habitToEdit?.notes || "");

    if (!habitToEdit) {
        return null;
    }
    const originalAmount = habitToEdit.completedValue;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!habitToEdit) return;
        const updatedHabit = {
            ...habitToEdit,
            completedValue: habitToEdit.completedValue + parseInt(completedAmount),
            completed: habitToEdit.completed || parseInt(completedAmount) >= habitToEdit.goal,
            notes: notes,
        };
        updateEntry(updatedHabit, "daily_habits");
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
                    <h2 className="text-2xl font-bold mb-4">{habitToEdit.habitName}</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="completedAmount">
                        Add {habitToEdit.unit}
                        </label>
                        <input
                        id="completedAmount"
                        type="number"
                        value={completedAmount}
                        placeholder="Enter an amount!"
                        className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => setCompletedAmount(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                        Notes
                        </label>
                        <textarea
                        id="notes"
                        value={notes}
                        placeholder="Enter notes"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                        onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-md text-gray-700 font-bold"> 
                    {completedAmount && `Total: ${originalAmount + parseInt(completedAmount)} / ${habitToEdit.goal} ${habitToEdit.unit}`}
                    </div>
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