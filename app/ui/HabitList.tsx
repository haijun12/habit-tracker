import Checkbox from "./Checkbox";
import Habit from "../models/Habit";
import { updateEntry } from "../utils/dailyHabitsAPI";
import { Reorder } from "framer-motion"

interface HabitListProps {
    habits: Habit[];
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    showEditPopup: (habit: Habit) => void;
    showTimerPopup: (habit: Habit) => void;
}

export default function HabitList({ habits, setHabits, showEditPopup, showTimerPopup }: HabitListProps) {

    function updateHabit(updatedHabit: Habit) {
        setHabits(habits.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
        updateEntry(updatedHabit, "daily_habits");
    }

    return (
        <div className="overflow-y-auto h-full">

        <Reorder.Group axis="y" values={habits} onReorder={setHabits}>

        {habits.map((habit, index) => (
            <Reorder.Item key={index} value={habit}>
            
            <HabitItem 
                key={index} 
                habit={habit} 
                showEditPopup={showEditPopup}
                updateHabit={updateHabit}
                showTimerPopup={showTimerPopup}
                />
            </Reorder.Item>
        ))}
        </Reorder.Group>
        </div>
    );
}

interface HabitItemProps {
    habit: Habit;
    updateHabit: (habit: Habit) => void;
    showEditPopup: (habit: Habit) => void;
    showTimerPopup: (habit: Habit) => void;
}

function HabitItem({ habit, showEditPopup, updateHabit, showTimerPopup }: HabitItemProps) {
    return (
        <div className="flex flex-row items-center text-lg mb-4">
            <Checkbox key = {habit.id} habit={habit} updateHabit={updateHabit} />
            <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-col px-4">
                    <div>{habit.habitName}</div>
                    <div>{habit.completedValue} / {habit.goal} {habit.unit}</div>
                </div>
                <div className="flex flex-row">
                    <button className="px-3 py-2 rounded hover:bg-slate-100 text-slate-500"
                            onClick={() => showTimerPopup(habit)}
                    >
                        <i className="fa-solid fa-stopwatch"></i>
                    </button>
                    <button className="px-4 py-2 rounded hover:bg-slate-100 text-slate-500" 
                            onClick={() => showEditPopup(habit)}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
