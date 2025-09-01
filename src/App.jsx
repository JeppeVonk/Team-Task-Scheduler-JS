import { useState } from "react";
import TaskForm from "./components/TaskForm";
import PlayerForm from "./components/PlayerForm";
import MatchForm from "./components/MatchForm";
import DistanceForm from "./components/DistanceForm";
import ScheduleTable from "./components/ScheduleTable";
import ExportButton from "./components/ExportButton";
import { buildSchedule } from "./utils/scheduler";
import { HOME_TEAM_NAME, RANDOM_SEED } from "./utils/config";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [distances, setDistances] = useState([]);
    const [result, setResult] = useState(null);

    function generate() {
        const { schedule, stats } = buildSchedule(tasks, players, matches, distances, RANDOM_SEED);
        setResult({ schedule, stats });
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <header className="flex items-baseline justify-between">
                <h1 className="text-3xl font-bold">🏑 Team Task Scheduler</h1>
                <div className="text-gray-600">{HOME_TEAM_NAME}</div>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                <TaskForm tasks={tasks} setTasks={setTasks} />
                <PlayerForm players={players} setPlayers={setPlayers} tasks={tasks} />
                <MatchForm matches={matches} setMatches={setMatches} />
                <DistanceForm distances={distances} setDistances={setDistances} />
            </div>

            <div className="flex gap-3">
                <button
                    onClick={generate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
                >
                    Genereer schema
                </button>
            </div>

            {result && (
                <>
                    <ScheduleTable schedule={result.schedule} stats={result.stats} />
                    <ExportButton schedule={result.schedule} stats={result.stats} />
                </>
            )}
        </div>
    );
}
