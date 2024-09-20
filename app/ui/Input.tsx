
export default function Input({label, type, value, onChange, placeholder} : {label: string, type: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string}) {
    return (
        <input
        id={label}
        type={type}
        value={value}
        placeholder={placeholder}
        className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        onChange={onChange}
        />
    )
}