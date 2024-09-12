import React, { useState } from "react";
import Habit from "../models/Habit";
import Button from '@mui/material/Button';
import { updateEntry } from "../utils/dailyHabitsAPI";

interface FormProps {
    closePopup: () => void;
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    habits: Habit[];
    habitToEdit: Habit | null;
}

export default function EditHabitForm({closePopup, setHabits, habits, habitToEdit} : FormProps) {
    if (!habitToEdit) {
        return null;
    }
    const originalAmount = habitToEdit.completedValue;
    const [completedAmount, setCompletedAmount] = useState("0");
    const [notes, setNotes] = useState(habitToEdit.notes);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!habitToEdit) return;
        const updatedHabit = {
            ...habitToEdit,
            completedValue: habitToEdit.completedValue + parseInt(completedAmount),
            completed: habitToEdit.completed || parseInt(completedAmount) >= habitToEdit.goal,
            notes: notes
        };
        updateEntry(updatedHabit);
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
        setHabits(habits.filter(habit => habit.id !== habit.id));
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
            <div className="bg-white p-16 rounded shadow-lg relative w-96 md:w-1/3 ">
                <button
                    className="absolute top-4 right-4 text-black text-2xl"
                    onClick={closePopup}
                >
                    X
                </button>
                <form onSubmit={handleSubmit}>
                    <div>Habit: {habitToEdit.habitName}</div>
                    <div> Add Time </div>
                    <input
                        type="number"
                        value={completedAmount}
                        placeholder={"Enter an amount!"}
                        className="border p-2 rounded w-3/4 mr-2"
                        onChange={(e) => {
                            setCompletedAmount(e.target.value);
                        }}
                    />
                    <input
                        type="text"
                        value={notes}
                        placeholder={"Enter notes"}
                        className="border p-2 rounded w-3/4 mr-2"
                        onChange={(e) => {
                            setNotes(e.target.value);
                        }}
                    />
                    <div> {completedAmount && `Total: ` + (originalAmount + parseInt(completedAmount)) + ` minutes`}</div>
                    <button
                        type="submit"
                        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                    <button className="absolute top-2 left-2 text-red-500 px-4 py-2 rounded hover:bg-slate-100" 
                            onClick={() => deleteHabit(habitToEdit.id)}
                    >
                        Remove Habit
                    </button>
                </form>
            </div>
        </div>
    )
}

/* Delete currently does not work */
// function deleteHabit({ habit, habits, setHabits } : HabitListProps & { habit: Habit }) {
//     const habitId = habit.id;
//     fetch(`/api/habits/`, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ habitId }),
//     })
//     .then(response => response.json())
//     .then(data => console.log(data));
//     setHabits(habits.filter(habit => habit.id !== habit.id));
// }
// function updateLog({ habit, habits, setHabits } : HabitListProps & { habit: Habit }) {
// };