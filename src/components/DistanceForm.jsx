import { useState } from "react";

export default function DistanceForm({ distances, setDistances }) {
    const [club, setClub] = useState("");
    const [km, setKm] = useState("");

    function addDistance() {
        if (!club || !km) return;
        setDistances([...distances, { club, afstand_km: parseInt(km) }]);
        setClub("");
        setKm("");
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-2">Afstanden</h2>
            <div className="flex gap-2 mb-2">
                <input
                    className="border p-1"
                    placeholder="Club"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                />
                <input
                    type="number"
                    className="border p-1 w-20"
                    placeholder="Km"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                />
                <button
                    onClick={addDistance}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    +
                </button>
            </div>
            <ul className="list-disc pl-5">
                {distances.map((d, i) => (
                    <li key={i}>
                        {d.club}: {d.afstand_km} km
                    </li>
                ))}
            </ul>
        </div>
    );
}
