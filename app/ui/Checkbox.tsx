import Habit from "../models/Habit";
import { useState } from "react";

interface CheckboxProps {
    habit: Habit;
    updateHabit: (habit: Habit) => void;
}
export default function Checkbox({ habit, updateHabit } : CheckboxProps) {
    const [isChecked, setIsChecked] = useState(habit.completed || habit.completedValue >= habit.goal);

    const handleCheckboxChange = () => {
        setIsChecked(!habit.completed);
        const updatedHabit = {
            ...habit,
            completed: !habit.completed || habit.completedValue == habit.goal,
            completedValue: !habit.completed ? habit.goal : habit.completedValue + 0
        };
        updateHabit(updatedHabit);
    };
    return (
        <label className="flex items-center cursor-pointer relative">
            <input 
                defaultChecked type="checkbox" 
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="peer h-8 w-8 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 " />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            </span>
        </label>
    )
}