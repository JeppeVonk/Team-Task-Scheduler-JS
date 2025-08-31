import { useState } from "react";
import TaskForm from "./components/TaskForm";
import PlayerForm from "./components/PlayerForm";
import MatchForm from "./components/MatchForm";
import DistanceForm from "./components/DistanceForm";
import ScheduleTable from "./components/ScheduleTable";
import ExportButton from "./components/ExportButton";
import { buildSchedule } from "./utils/scheduler";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [distances, setDistances] = useState([]);
    const [schedule, setSchedule] = useState(null);

    function generate() {
        const { schedule, stats } = buildSchedule(tasks, players, matches, distances);
        setSchedule({ schedule, stats });
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">🏑 Team Task Scheduler</h1>

            <TaskForm tasks={tasks} setTasks={setTasks} />
            <PlayerForm players={players} setPlayers={setPlayers} tasks={tasks} />
            <MatchForm matches={matches} setMatches={setMatches} />
            <DistanceForm distances={distances} setDistances={setDistances} />

            <button
                onClick={generate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                Genereer schema
            </button>

            {schedule && (
                <>
                    <ScheduleTable schedule={schedule.schedule} />
                    <ExportButton schedule={schedule.schedule} stats={schedule.stats} />
                </>
            )}
        </div>
    );
}
