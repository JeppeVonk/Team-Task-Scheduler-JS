export default function ScheduleTable({ schedule, stats }) {
    // Dynamische kolommen voor schedule
    const scheduleCols = schedule.length ? Object.keys(schedule[0]) : [];
    const statCols = stats.length ? Object.keys(stats[0]) : [];

    return (
        <div className="grid gap-6">
            <div className="p-4 border rounded-lg bg-white shadow">
                <h2 className="text-xl font-bold mb-3">Schema</h2>
                <div className="overflow-auto">
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                {scheduleCols.map((h,i)=>(
                                    <th key={i} className="border px-2 py-1 text-left">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((row, ri) => (
                                <tr key={ri}>
                                    {scheduleCols.map((h,ci)=>(
                                        <td key={ci} className="border px-2 py-1">
                                            {row[h]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 border rounded-lg bg-white shadow">
                <h2 className="text-xl font-bold mb-3">Statistieken</h2>
                <div className="overflow-auto">
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                {statCols.map((h,i)=>(
                                    <th key={i} className="border px-2 py-1 text-left">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((row, ri)=>(
                                <tr key={ri}>
                                    {statCols.map((h,ci)=>(
                                        <td key={ci} className="border px-2 py-1">
                                            {row[h]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
