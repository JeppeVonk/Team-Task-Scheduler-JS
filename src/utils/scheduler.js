// Placeholder: hier komt de echte verdelingslogica
// Voor nu maken we een dummy schema en statistieken

export function buildSchedule(tasks, players, matches, distances) {
    // TODO: port Python scheduler.py -> JS
    const schedule = matches.map((m) => ({
        date: `${m.jaar}-${m.maand}-${m.dag}`,
        opponent: m.club,
        uit: m.isUit === "ja",
        tasks: tasks.map((t) => ({
            taak: t.taak,
            assigned: players.length ? players[Math.floor(Math.random() * players.length)].displaynaam : "-"
        })),
    }));

    const stats = players.map((p) => ({
        speler: p.displaynaam,
        taken: Math.floor(Math.random() * 10),
        kilometers: Math.floor(Math.random() * 200),
    }));

    return { schedule, stats };
}
