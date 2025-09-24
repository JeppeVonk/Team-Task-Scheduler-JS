import { useState } from "react";
import { exportCSV, importCSV } from "../utils/csvHelpers";

export default function DistanceForm({ distances, setDistances }) {
    const [club, setClub] = useState("");
    const [km, setKm] = useState("");

    function addDistance() {
        if (!club || !km) return;
        setDistances([...distances, { club, afstand_km: Number(km) }]);
        setClub("");
        setKm("");
    }

    function removeDistance(idx) {
        setDistances(distances.filter((_,i)=>i!==idx));
    }

    function handleExport() {
        const headers = ["Club", "AfstandKm"];
        const rows = distances.map(d => [d.club, d.afstand_km]);
        exportCSV("afstanden.csv", headers, rows);
    }

    async function handleImport(e) {
        const rows = await importCSV(e.target.files[0]);
        const imported = rows.map(([club, km]) => ({
            club, afstand_km: Number(km ?? 0),
        }));
        setDistances(imported);
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-bold mb-2">Afstanden</h2>
                <div className="flex gap-2">
                    <label className="text-sm underline cursor-pointer">
                        Import CSV
                        <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
                    </label>
                    <button onClick={handleExport} className="text-sm underline cursor-pointer">Export CSV</button>
                </div>
            </div>
            <div className="flex gap-2 mb-2">
                <input
                    className="border p-1"
                    placeholder="Club"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                />
                <input
                    type="number"
                    className="border p-1 w-24"
                    placeholder="Km"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                />
                <button
                    onClick={addDistance}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                    +
                </button>
            </div>
            <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Club</th>
                        <th className="border px-2 py-1">Km</th>
                        <th className="border px-2 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {distances.map((d,i)=>(
                        <tr key={i}>
                            <td className="border px-2 py-1">{d.club}</td>
                            <td className="border px-2 py-1 text-right">{d.afstand_km}</td>
                            <td className="border px-2 py-1 text-center">
                                <button
                                    onClick={()=>removeDistance(i)}
                                    className="text-red-600"
                                >
                                    ✕
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
