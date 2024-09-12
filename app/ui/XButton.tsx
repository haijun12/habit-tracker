
export default function XButton({ closePopup } : { closePopup: () => void }) {
    return (
        <button
            className="absolute top-4 right-4 text-black text-2xl px-3 py-1 rounded hover:bg-slate-100"
            onClick={closePopup}
        >
            X
        </button>
    )
}