import Habit from "../models/Habit";
import XButton from "./XButton";
import { useState, useEffect, useRef } from "react";

interface TimerProps {
    habitToEdit: Habit | null;
    showTimerPopup: (popupType: 'timer' | 'edit', habit?: Habit) => void;
    updateHabit: (habit: Habit) => void;
}

export default function Timer({ habitToEdit, showTimerPopup, updateHabit } : TimerProps) {
    const [initialStartTime, setInitialStartTime] = useState(30);
    const [minutes, setMinutes] = useState(30);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } 
                if (seconds === 0) {
                    if (minutes === 0 ) {
                        clearInterval(intervalRef.current!);
                        setIsActive(false);
                        alert("Timer finished!")
                        alert(initialStartTime)
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                }
            }, 1000);
        } else if (!isActive && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current!); 
    }, [isActive, minutes, seconds]);
    
    if (!habitToEdit) {
        return null;
    }
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!habitToEdit) return;
        const updatedHabit = {
            ...habitToEdit,
            completedValue: habitToEdit.completedValue + (initialStartTime - minutes),
            completed: habitToEdit.completed || habitToEdit.completedValue + (initialStartTime - minutes) >= habitToEdit.goal,
        };
        updateHabit(updatedHabit);
        showTimerPopup('timer');
        setIsActive(false);
    }

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setMinutes(30);
        setSeconds(0);
        setIsActive(false);
        setInitialStartTime(30);
        clearInterval(intervalRef.current!);
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
            <div className="bg-white p-16 rounded shadow-lg relative w-96 md:w-1/3 ">
                <XButton closePopup={() => showTimerPopup('timer')} />
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4">Timer for {habitToEdit.habitName}</h2>
                    <div className="text-6xl font-bold text-center mb-4">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <div className="flex justify-center space-x-4 mb-4">
                        <button
                            type="button"
                            onClick={toggleTimer}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                            {isActive ? 'Pause' : 'Start'}
                        </button>
                        <button
                            type="button"
                            onClick={resetTimer}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Reset
                        </button>
                    </div>
                    <div className="flex justify-center items-center space-x-2">
                        <label htmlFor="minutes" className="font-bold">Set Minutes:</label>
                        <input
                            type="number"
                            id="minutes"
                            value={minutes}
                            onChange={(e) => {setMinutes(Math.max(0, parseInt(e.target.value))); setInitialStartTime(parseInt(e.target.value));}}
                            className="border rounded px-2 py-2 w-1/4 text-center"
                            min="0"
                        />
                    </div>
                    <button
                        type="submit"
                        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-slate-500"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}