import { useState } from "react";

export default function PlayerForm({ players, setPlayers, tasks }) {
    const [naam, setNaam] = useState("");
    const [display, setDisplay] = useState("");

    function addPlayer() {
        if (!naam || !display) return;
        const preferences = {};
        tasks.forEach((t) => (preferences[t.taak] = 2));
        setPlayers([...players, { naam, displaynaam: display, preferences }]);
        setNaam("");
        setDisplay("");
    }

    function updatePreference(idx, taak, val) {
        const updated = [...players];
        updated[idx].preferences[taak] = parseInt(val);
        setPlayers(updated);
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-2">Spelers</h2>
            <div className="flex gap-2 mb-2">
                <input
                    className="border p-1"
                    placeholder="Volledige naam"
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                />
                <input
                    className="border p-1"
                    placeholder="Displaynaam"
                    value={display}
                    onChange={(e) => setDisplay(e.target.value)}
                />
                <button
                    onClick={addPlayer}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    +
                </button>
            </div>

            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border px-2">Naam</th>
                        <th className="border px-2">Display</th>
                        {tasks.map((t, i) => (
                            <th key={i} className="border px-2">{t.taak}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {players.map((p, i) => (
                        <tr key={i}>
                            <td className="border px-2">{p.naam}</td>
                            <td className="border px-2">{p.displaynaam}</td>
                            {tasks.map((t, j) => (
                                <td key={j} className="border px-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="3"
                                        value={p.preferences[t.taak]}
                                        onChange={(e) => updatePreference(i, t.taak, e.target.value)}
                                        className="w-12 border"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
