import { useState, useEffect } from "react";

export default function DateDisplay({ setDate }: { setDate: React.Dispatch<React.SetStateAction<Date>> }) {
    const [dates, setDates] = useState<string[]>([]);
    const startOfLastWeek = new Date();
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);

    useEffect(() => {
        const newDates: string[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfLastWeek);
            date.setDate(startOfLastWeek.getDate() + i);
            newDates.push(DateFormat(date));
        }
        setDates(newDates);
    }, []);

    const handleDateClick = (date: Date) => {
        setDate(date);
    };

    return (
        <div className="flex flex-row items-center justify-between my-4">
            {dates.map((date, index) => {
                const dateObj = new Date();
                dateObj.setDate(dateObj.getDate() - 6 + index);
                return (
                    <div 
                        key={index} 
                        className="text-lg cursor-pointer" 
                        onClick={() => handleDateClick(dateObj)}
                    >
                        {date}
                    </div>
                );
            })}
        </div>
    );
}

function DateFormat(date: Date | null) {
    if (!date) {
        return 'Loading...';
    }

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();

    return `${day} | ${dayOfWeek}`;
}
