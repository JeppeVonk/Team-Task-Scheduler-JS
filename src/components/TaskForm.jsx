import { useState } from "react";

export default function TaskForm({ tasks, setTasks }) {
    const [taak, setTaak] = useState("");
    const [scope, setScope] = useState("altijd");
    const [aantal, setAantal] = useState(1);

    function addTask() {
        if (!taak) return;
        setTasks([...tasks, { taak, scope, aantal: Number(aantal) }]);
        setTaak("");
        setAantal(1);
    }

    function removeTask(idx) {
        setTasks(tasks.filter((_, i) => i !== idx));
    }

    function exportCSV() {
        const headers = ["Taak", "Scope", "Aantal"];
        const rows = tasks.map(t => [t.taak, t.scope, t.aantal]);

        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "taken.csv";
        a.click();

        URL.revokeObjectURL(url);
    }

    async function importCSV(e) {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const [headerLine, ...lines] = text.split("\n").map(l => l.split(",").map(s => s.replace(/(^"|"$)/g, "")));

        const imported = lines.filter(l => l.length > 1).map(([taak, scope, aantal]) => ({
            taak, scope, aantal: Number(aantal ?? 1),
        }));

        setTasks(imported);
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-bold mb-2">Taken</h2>
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
                    className="border p-1"
                    placeholder="Taak"
                    value={taak}
                    onChange={(e) => setTaak(e.target.value)}
                />
                <select
                    className="border p-1"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                >
                    <option value="altijd">Altijd</option>
                    <option value="uit">Uit</option>
                    <option value="thuis">Thuis</option>
                </select>
                <input
                    type="number"
                    min="1"
                    className="border p-1 w-16"
                    value={aantal}
                    onChange={(e) => setAantal(e.target.value)}
                />
                <button
                    onClick={addTask}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                    +
                </button>
            </div>
            <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-left">Taak</th>
                        <th className="border px-2 py-1">Scope</th>
                        <th className="border px-2 py-1">Aantal</th>
                        <th className="border px-2 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((t,i)=>(
                        <tr key={i}>
                            <td className="border px-2 py-1">{t.taak}</td>
                            <td className="border px-2 py-1 text-center">{t.scope}</td>
                            <td className="border px-2 py-1 text-center">{t.aantal}</td>
                            <td className="border px-2 py-1 text-center">
                                <button
                                    onClick={()=>removeTask(i)}
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
