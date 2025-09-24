import { useState } from "react";

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

    function exportCSV() {
        const headers = ["Jaar", "Maand", "Dag", "Club", "Team", "Uit?"];
        const rows = matches.map(m => [m.jaar, m.maand, m.dag, m.club, m.team, m.isUit]);

        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
        const blob = new Blob ([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "wedstrijden.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    async function importCSV(e) {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const [headerLine, ...lines] = text.split("\n").map(l => l.split(",").map(s => s.replace(/(^"|"$)/g, "")));

        const imported = lines.filter(l => l.length > 1).map(([jaar, maand, dag, club, team, isUit]) => ({
            jaar, maand, dag, club, team, isUit
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
                        <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
                    </label>
                    <button onClick={exportCSV} className="text-sm underline cursor-pointer">Export CSV</button>
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
