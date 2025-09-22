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

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-2">Taken</h2>
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
