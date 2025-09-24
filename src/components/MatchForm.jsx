import { useState } from "react";
import { exportCSV, importCSV } from "../utils/csvHelpers";

export default function MatchForm({ matches, setMatches }) {
    const [date, setDate] = useState("");
    const [club, setClub] = useState("");
    const [team, setTeam] = useState("");
    const [isUit, setIsUit] = useState("nee");

    function addMatch() {
        if (!date || !club) return;
        const [jaar, maand, dag] = date.split("-");
        setMatches([...matches, { jaar, maand, dag, club, team, isUit }]);
        setDate("");
        setClub("");
        setTeam("");
    }

    function removeMatch(idx) {
        setMatches(matches.filter((_,i)=>i!==idx));
    }

    function handleExport() {
        const headers = ["Jaar", "Maand", "Dag", "Club", "Team", "Uit?"];
        const rows = matches.map(m => [m.jaar, m.maand, m.dag, m.club, m.team, m.isUit]);
        exportCSV("wedstrijden.csv", headers, rows);
    }

    async function handleImport(e) {
        const rows = await importCSV(e.target.files[0]);
        const imported = rows.map(([jaar, maand, dag, club, team, isUit]) => ({
            jaar, maand, dag, club, team, isUit,
        }));
        setMatches(imported);
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-bold mb-2">Wedstrijden</h2>
                <div className="flex gap-2">
                    <label className="text-sm underline cursor-pointer">
                        Import CSV
                        <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
                    </label>
                    <button onClick={handleExport} className="text-sm underline cursor-pointer">Export CSV</button>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <input
                    className="border p-1"
                    placeholder="Club"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                />
                <input
                    className="border p-1"
                    placeholder="Team"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                />
                <select
                    value={isUit}
                    onChange={(e) => setIsUit(e.target.value)}
                    className="border p-1"
                >
                    <option value="nee">Thuis</option>
                    <option value="ja">Uit</option>
                </select>
                <button
                    onClick={addMatch}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                    +
                </button>
            </div>

            <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Datum</th>
                        <th className="border px-2 py-1">Club</th>
                        <th className="border px-2 py-1">Team</th>
                        <th className="border px-2 py-1">Uit/Thuis</th>
                        <th className="border px-2 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((m,i)=>(
                        <tr key={i}>
                            <td className="border px-2 py-1">{m.jaar}-{m.maand}-{m.dag}</td>
                            <td className="border px-2 py-1">{m.club}</td>
                            <td className="border px-2 py-1">{m.team}</td>
                            <td className="border px-2 py-1">{m.isUit === "ja" ? "Uit" : "Thuis"}</td>
                            <td className="border px-2 py-1 text-center">
                                <button
                                    onClick={()=>removeMatch(i)}
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
