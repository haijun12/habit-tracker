import Habit from "../models/Habit";

export default function Statistics({ habits } : { habits: Habit[] }) {
    let totalTime = 0;
    let completedTime = 0;
    
    habits.forEach(habit => {
        if (habit.unit === "minutes") {
            totalTime += habit.goal;
            completedTime += habit.completedValue;
        }
    });

    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-gray-700 text-2xl font-bold mb-4"> Daily Stats</h2>
            <div className="text-gray-700 text-lg font-bold">Total Time Spent: {completedTime} / {totalTime} minutes</div>
            {/* <div className="text-gray-700 text-lg font-bold">Average Time Per Day: {Math.round(completedTime / 7)} minutes</div> */}
        </div>
    );
}