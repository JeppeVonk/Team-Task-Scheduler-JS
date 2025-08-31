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

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-2">Wedstrijden</h2>
            <div className="flex gap-2 mb-2">
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
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    +
                </button>
            </div>
            <ul className="list-disc pl-5">
                {matches.map((m, i) => (
                    <li key={i}>
                        {m.jaar}-{m.maand}-{m.dag}: {m.club} ({m.isUit === "ja" ? "Uit" : "Thuis"})
                    </li>
                ))}
            </ul>
        </div>
    );
}
