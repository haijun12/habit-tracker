export default class Habit {
    habitName: string;
    goal: number;
    unit: string;
    days: boolean[];

    constructor(habitName: string, goal: number, unit: string, days: boolean[] = Array(7).fill(true)) {
        this.habitName = habitName;
        this.goal = goal;
        this.unit = unit;
        this.days = days;
    }
}