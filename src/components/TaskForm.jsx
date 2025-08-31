import { useState } from "react";

export default function TaskForm({ tasks, setTasks }) {
    const [taak, setTaak] = useState("");
    const [scope, setScope] = useState("altijd");
    const [aantal, setAantal] = useState(1);

    function addTask() {
        if (!taak) return;
        setTasks([...tasks, { taak, scope, aantal: parseInt(aantal) }]);
        setTaak("");
        setAantal(1);
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-2">Taken</h2>
            <div className="flex gap-2 mb-2">
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
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    +
                </button>
                <ul className="list-disc pl-5">
                    {tasks.map((t, i) => (
                        <li key={i}>
                            {t.taak} ({t.scope}, {t.aantal} pers.)
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
