import React, { useState } from "react";
import Habit from "../models/Habit";
import XButton from "./XButton";

interface FormProps {
    closePopup: () => void;
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    habits: Habit[];
}

const unitsOfMeasurement = ["minutes", "miles", "steps", "reps", "hours"];
const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
export default function MultiPageForm({ closePopup, setHabits, habits }: FormProps) {
    const [newHabits, setNewHabits] = useState<Habit[]>([new Habit("", 0, "minutes")]);
    const [page, setPage] = useState(1);
    const minPage = 1;
    const maxPage = 3;

    const addHabit = () => {
        setNewHabits([...newHabits, new Habit("", 0, "minutes")]);
    };

    const updateHabit = (index: number, field: string, value: string | boolean, day = -1) => {
        const updatedHabits = [...newHabits];
        if (day != -1) {
            //  Update a single day
            const updatedDays = [...updatedHabits[index].days];
            if (typeof value === "boolean") {
                updatedDays[day] = value;
            }

            updatedHabits[index] = { ...updatedHabits[index], [field]: updatedDays };
        } else {
            // Update other fields
            updatedHabits[index] = { ...updatedHabits[index], [field]: value };
        }
        setNewHabits(updatedHabits);
    };
    
    const removeHabit = (index: number) => {
        setNewHabits(newHabits.filter((_, i) => i !== index));
    };

    const updatePage = (value: number) => {
        setPage(page + value);  
    };
    function updateHabits(newHabits: Habit[]) {
        fetch('/api/habits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newHabits }),
        })
        .then(response => response.json())
        .then(data => console.log(data));

    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(newHabits);
        if (habits.length === 0) {
            setHabits([...newHabits]);
        } else {
            setHabits([...habits, ...newHabits]);
        }
        closePopup();
        updateHabits(newHabits);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
            <div className="bg-white p-16 rounded shadow-lg relative w-96 md:w-1/3 ">
                <XButton closePopup={closePopup} />
                <form onSubmit={handleSubmit}>
                    {newHabits.map((habit, index) => (
                        <>
                        <div className="text-xl mb-4"> Habits:</div>
                        <div key={index} className="mb-4 flex flex-row">
                            {page === 1 &&
                                <input
                                type="text"
                                value={habit.habitName}
                                placeholder={"Enter a habit!"}
                                className="border p-2 rounded w-3/4 mr-4"
                                onChange={(e) => updateHabit(index, "habitName", e.target.value)}
                                />
                            }
                            {page === 2 &&
                                
                                <div className="flex flex-row">

                                    <input
                                        type="number"
                                        value={habit.goal}
                                        placeholder={"Enter a goal!"}
                                        className="border p-2 rounded w-3/4 mr-2"
                                        onChange={(e) => updateHabit(index, "goal", e.target.value)}
                                        />
                                    <select
                                        value={habit.unit}
                                        className="border p-2 rounded w-2/4 mr-2"
                                        onChange={(e) => updateHabit(index, "unit", e.target.value)}
                                        >
                                        {unitsOfMeasurement.map((unit) => (
                                            <option key={unit} value={unit}>
                                                {unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                            }
                            {page === 3 && 
                                <div className="flex flex-row justify-left">

                                    {daysOfWeek.map((day, i) => (
                                        <button
                                        type="button"
                                        key={day}
                                        className={`w-10 h-10 p-2 border-2 rounded-full mr-2 ${
                                            habit.days[i] ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-800 border-gray-300"
                                        } hover:bg-blue-200 transition-colors`}
                                        onClick={() => updateHabit(index, "days", !habit.days[i], i)}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            }
                            <button
                                type="button"
                                className="text-red-500 px-4 py-2 rounded hover:bg-slate-100"
                                onClick={() => removeHabit(index)}
                                >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </>
                    ))}
                    <button
                        type="button"
                        className="text-white bg-slate-500 p-2 rounded mb-4 hover:bg-slate-200"
                        onClick={addHabit}
                        >
                        New Habit
                    </button>
                    {page < maxPage && (
                        <button
                            type="button"
                            className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-slate-500"
                            onClick={() => updatePage(1)}
                        >
                            Next
                        </button>
                    )}
                    {page > minPage && (
                        <button
                            type="button"
                            className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-slate-500"
                            onClick={() => updatePage(-1)}
                        >
                            Prev
                        </button>
                    )}
                    {page === maxPage && (
                        <button
                            type="submit"
                            className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-slate-500"
                        >
                            Submit
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
