export default function ScheduleTable({ schedule }) {
    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-2">Schema</h2>
            <pre className="bg-gray-100 p-2 text-sm">
                {JSON.stringify(schedule, null, 2)}
            </pre>
        </div>
    );
}
