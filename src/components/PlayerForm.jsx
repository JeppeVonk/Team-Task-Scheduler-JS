import { useMemo, useState } from "react";

export default function PlayerForm({ players, setPlayers, tasks }) {
    const [naam, setNaam] = useState("");
    const [display, setDisplay] = useState("");

    const taskNames = useMemo(()=>tasks.map(t=>t.taak), [tasks]);

    function addPlayer() {
        if (!naam || !display) return;
        const preferences = Object.fromEntries(taskNames.map(t=>[t,2]));
        setPlayers([...players, { naam, displaynaam: display, preferences }]);
        setNaam("");
        setDisplay("");
    }

    function removePlayer(idx) {
        setPlayers(players.filter((_,i)=>i!==idx));
    }

    function updatePreference(idx, taak, val) {
        const updated = [...players];
        updated[idx].preferences[taak] = Number(val);
        setPlayers(updated);
    }

    function exportCSV() {
        const headers = ["Naam", "Display", ...taskNames];
        const rows = players.map(p => [
            p.naam,
            p.displaynaam,
            ...taskNames.map(t => p.preferences?.[t] ?? 2)
        ]);

        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "spelers.csv";
        a.click();

        URL.revokeObjectURL(url);
    }

    async function importCSV(e) {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const [headerLine, ...lines] = text.split("\n").map(l => l.split(",").map(s => s.replace(/(^"|"$)/g, "")));

        const taskHeaders = headerLine.slice(2); // after Naam + Display
        const importedPlayers = lines.filter(l => l.length > 1).map(line => {
            const [naam, display, ...prefs] = line;
            const preferences = Object.fromEntries(taskHeaders.map((t, i) => [t, Number(prefs[i] ?? 2)]));
            return { naam, displaynaam: display, preferences };
        });

        setPlayers(importedPlayers);
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-bold mb-2">Spelers</h2>
                <div className="flex gap-2">
                    <label className="text-sm underline cursor-pointer">
                        Import CSV
                        <input
                            type="file"
                            accept=".csv"
                            onChange={importCSV}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={exportCSV}
                        className="text-sm underline cursor-pointer"
                    >
                        Export CSV
                    </button>
                </div>
            </div>
            <div className="flex gap-2 mb-2">
                <input
                    className="border p-1"
                    placeholder="Volledige naam"
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                />
                <input
                    className="border p-1"
                    placeholder="Displaynaam (uniek)"
                    value={display}
                    onChange={(e) => setDisplay(e.target.value)}
                />
                <button
                    onClick={addPlayer}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                    +
                </button>
            </div>

            <div className="overflow-auto">
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Naam</th>
                            <th className="border px-2 py-1">Display</th>
                            {taskNames.map((t, i) => (
                                <th key={i} className="border px-2 py-1">{t}</th>
                            ))}
                            <th className="border px-2 py-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((p, i) => (
                            <tr key={i}>
                                <td className="border px-2 py-1">{p.naam}</td>
                                <td className="border px-2 py-1">{p.displaynaam}</td>
                                {taskNames.map((t, j) => (
                                    <td key={j} className="border px-1 py-1 text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            max="3"
                                            value={p.preferences?.[t] ?? 2}
                                            onChange={(e) => updatePreference(i, t, e.target.value)}
                                            className="w-14 border"
                                        />
                                    </td>
                                ))}
                                <td className="border px-2 py-1 text-center">
                                    <button
                                        onClick={()=>removePlayer(i)}
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
        </div>
    );
}
