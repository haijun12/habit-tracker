import Habit from "../models/Habit";

export default function Statistics({ habits } : { habits: Habit[] }) {
    const statMap = new Map<string, [number, number]>();
    habits.forEach(habit => {
        const [total, completed] = statMap.get(habit.unit) ?? [0, 0];
    
        statMap.set(habit.unit, [total + habit.goal, completed + habit.completedValue]);
    });

    return (
        <div className="flex flex-col items-center justify-center my-4">
            <h2 className="text-gray-700 text-2xl font-bold mb-4"> Daily Stats</h2>
            {Array.from(statMap.entries()).map(([unit, [total, completed]]) => (
                <div key = {unit} className="text-gray-700 text-lg font-bold">{completed} / {total} {unit}</div>
            ))}
        </div>
    );
}