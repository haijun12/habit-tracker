import React, { useState } from "react";

interface FormProps {
    closePopup: () => void;
    setHabits: React.Dispatch<React.SetStateAction<string[][]>>;
    habits: string[][];
}

export default function MultiPageForm({ closePopup, setHabits, habits }: FormProps) {
    const [newHabits, setNewHabits] = useState<string[][]>([["", ""]]);
    const placeHolders = ["Enter Habit", "Enter Time (In Minutes)"];
    const [page, setPage] = useState(1);
    const minPage = 1;
    const maxPage = 2;

    const addHabit = () => {
        setNewHabits([...newHabits, ["", ""]]);
    };

    const changeHabit = (habitIndex: number, value: string) => {
        const updatedHabits = [...newHabits];
        updatedHabits[habitIndex][page - 1] = value;
        setNewHabits(updatedHabits);
    };

    const removeHabit = (index: number) => {
        setNewHabits(newHabits.filter((_, i) => i !== index));
    };

    const updatePage = (value: number) => {
        setPage(page + value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setHabits(newHabits);
        closePopup(); 
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-16 rounded shadow-lg relative max-w-96">
                <button
                    className="absolute top-4 right-4 text-black text-2xl"
                    onClick={closePopup}
                >
                    X
                </button>
                <form onSubmit={handleSubmit}>
                    {newHabits.map((habit, index) => (
                        <div key={index} className="mb-4">
                            <input
                                type="text"
                                value={habit[page - 1]}
                                placeholder={placeHolders[page - 1]}
                                className="border p-2 rounded w-3/4 mr-4"
                                onChange={(e) => changeHabit(index, e.target.value)}
                            />
                            <button
                                type="button"
                                className="text-white bg-slate-400 p-2 px-4 rounded"
                                onClick={() => removeHabit(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="text-white bg-slate-500 p-2 rounded mb-4"
                        onClick={addHabit}
                    >
                        New Habit
                    </button>
                    {page < maxPage && (
                        <button
                            type="button"
                            className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => updatePage(1)}
                        >
                            Next
                        </button>
                    )}
                    {page > minPage && (
                        <button
                            type="button"
                            className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => updatePage(-1)}
                        >
                            Prev
                        </button>
                    )}
                    {page === maxPage && (
                        <button
                            type="submit"
                            className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
