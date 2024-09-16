import { useState, useEffect } from "react";
interface DateDisplayProps {
    CurrDate: Date | null;
    setCurrDate: React.Dispatch<React.SetStateAction<Date>>;
    setCurrDayOfWeek: React.Dispatch<React.SetStateAction<number>>;
}

export default function DateDisplay({ CurrDate, setCurrDate, setCurrDayOfWeek}: DateDisplayProps) {
    // Adjust the type to match the format returned by DateFormat: [string, number]
    const [dates, setDates] = useState<[string, number][]>([]);

    const startOfLastWeek = new Date();
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);

    useEffect(() => {
        const newDates: [string, number][] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfLastWeek);
            date.setDate(startOfLastWeek.getDate() + i);
            newDates.push(DateFormat(date));
        }
        setDates(newDates);
    }, []);

    const handleDateClick = (date: Date) => {
        setCurrDate(date);
        setCurrDayOfWeek(date.getDay());
    };

    return (
        <div className="flex flex-row items-center justify-between my-4">
            {dates.map((date, index) => {
                const dateObj = new Date();
                dateObj.setDate(dateObj.getDate() - 6 + index);
                const isSelected = dateObj.toDateString() === CurrDate?.toDateString();

                return (
                    <div
                        key={index}
                        className={`flex flex-col items-center justify-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                            isSelected ? "bg-blue-500 text-white transform scale-110" : "hover:bg-gray-200"
                        }`}
                        onClick={() => handleDateClick(dateObj)}
                    >
                        <span className="text-md">{date[0]}</span> {/* day of the week */}
                        <span className={`text-xl font-bold ${isSelected ? "text-white" : "text-gray-800"}`}>
                            {date[1]}
                        </span> {/* day of the month */}
                    </div>
                );
            })}
        </div>
    );
}

function DateFormat(date: Date): [string, number] {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();

    return [dayOfWeek, day];
}
