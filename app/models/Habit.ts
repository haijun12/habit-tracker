export default class Habit {
    id: number;
    habitName: string;
    goal: number;
    unit: string;
    days: boolean[];

    constructor(habitName: string, goal: number, unit: string, days: boolean[] = Array(7).fill(true), id: number = 0) {
        this.id = id;
        this.habitName = habitName;
        this.goal = goal;
        this.unit = unit;
        this.days = days;
    }
}