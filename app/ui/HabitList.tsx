import Checkbox from "./Checkbox";
import Habit from "../models/Habit";

interface HabitListProps {
    habits: Habit[];
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    editHabit: (habit: Habit) => void;
}

export default function HabitList(props: HabitListProps) {
    let totalTime = 0;
    
    // Calculate total time based on habit unit
    props.habits.forEach(habit => {
        if (habit.unit === "minutes") {
            totalTime += habit.goal;
        }
    });

    return (
        <>
            <div className="my-8">
                {props.habits.map((habit, index) => (
                    <HabitItem 
                        key={index} 
                        habit={habit} 
                        editHabit={props.editHabit}
                    />
                ))}
            </div>
            <div>Total Time: {totalTime} minutes</div>
        </>
    );
}

interface HabitItemProps {
    habit: Habit;
    editHabit: (habit: Habit) => void;
}

function HabitItem({ habit, editHabit }: HabitItemProps) {
    return (
        <div className="flex flex-row items-center text-lg mb-4">
            <Checkbox habit={habit} />
            <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-col px-4">
                    <div>{habit.habitName}</div>
                    <div>{habit.completedValue} / {habit.goal} {habit.unit}</div>
                </div>
                <div className="flex flex-row">
                    <button className="px-3 py-2 rounded hover:bg-slate-100 text-slate-500">
                        <i className="fa-solid fa-stopwatch"></i>
                    </button>
                    <button className="px-4 py-2 rounded hover:bg-slate-100 text-slate-500" 
                            onClick={() => editHabit(habit)}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
