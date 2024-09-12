"use client";
import { useState, useEffect, use } from "react";
export default function DateDisplay() {
    // const [date, setDate] = useState<string>('');

    // const date = new Date(); // This is your DATE or TIMESTAMP from the database
    // const entryDate = date.toLocaleDateString('en-US');
    const formattedDate = DateFormat(new Date());

    // async function getEntry() {
    //     const response = await fetch (`/api/daily_habits?date=${encodeURIComponent(entryDate)}`, ({
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     }))
    //     const data = await response.json();
    //     console.log("result from api", data);
    // }

    // useEffect(() => {
    //     getEntry();
    // }, []);


    return (
        <div className="flex flex-row items-center justify-between">
            <div className="text-lg">{formattedDate}</div>
        </div>
    );
}

function DateFormat(date: Date | null) {
    if (!date) {
        return 'Loading...';
    }
    let period = "am";
    let hours = date.getHours().toString().padStart(2, '0');
    if (parseInt(hours) > 12) {
        hours = String(parseInt(hours) - 12);
        period = "pm";
    }
    
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year} | ${dayOfWeek} ${hours}:${minutes} ${period}`;
}