export default function DateDisplay() {
    const formattedDate = DateFormat(new Date());


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