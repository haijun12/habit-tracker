export default class Habit {
    id: number;
    habitName: string;
    goal: number;
    unit: string;
    days: boolean[];
    entryId: number;
    entryDate: Date;
    completed: boolean;
    notes: string;
    completedValue: number;

    constructor(habitName: string, goal: number, 
                unit: string, days: boolean[] = Array(7).fill(true), 
                id: number = 0, entryId: number = 0, 
                entryDate: Date = new Date(), completed: boolean = false, 
                notes: string = '', completedValue: number = 0) {
        this.id = id;
        this.habitName = habitName;
        this.goal = goal;
        this.unit = unit;
        this.days = days;
        this.entryId = entryId;
        this.entryDate = entryDate;
        this.completed = completed;
        this.notes = notes;
        this.completedValue = completedValue;
    }
}