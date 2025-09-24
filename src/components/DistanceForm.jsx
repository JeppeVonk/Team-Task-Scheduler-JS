import { useState } from "react";

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

    function exportCSV() {
        const headers = ["Club", "AfstandKm"];
        const rows = distances.map(d => [d.club, d.afstand_km]);

        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type:"text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "afstanden.csv";
        a.click();
        
        URL.revokeObjectURL(url);
    }

    async function importCSV(e) {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const [headerLine, ...lines] = text.split("\n").map(l => l.split(",").map(s => s.replace(/(^"|"$)/g, "")));

        const imported = lines.filter(l => l.length > 1).map(([club, km]) => ({
            club,
            afstand_km: Number(km ?? 0),
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
                        <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
                    </label>
                    <button onClick={exportCSV} className="text-sm underline cursor-pointer">Export CSV</button>
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
