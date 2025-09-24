// Port van de Python-logica naar JS (frontend-only)
// Bron: task_planner/{scheduler,utils,models}.py

import { AVOID_CONSECUTIVE } from "./config";

function parseBoolJaNee(v) {
    return String(v).trim().toLowerCase() === "ja" ||
            ["j","y","yes","true","1"].includes(String(v).trim().toLowerCase());
}

function mkdate(y, m, d) {
    // JS Date: maanden 0-11; we bewaren ook een YYYY-MM-DD string
    const yyyy = Number(y), mm = Number(m), dd = Number(d);
    return {
        d: new Date(yyyy, mm - 1, dd),
        s: `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`,
    };
}

// Deterministische RNG & shuffle (mulberry32)
function mulberry32(seed) {
    let t = seed >>> 0;
    return function() {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

function shufflePlayers(players, seed = 42) {
    const rnd = mulberry32(seed);
    const arr = [...players];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function emptyStats(taskNames) {
    const per_task = Object.fromEntries(taskNames.map(t => [t, 0]));
    return { per_task, total_tasks: 0, km: 0, last_week_index: null };
}

/**
 * Deterministic string -> 24-bit hex color.
 * Uses FNV-1a 32-bit then splits to RGB, then mixes with white like the Python
 * did (averaging with 255) so colors are lighter and have good readability.
 */
export function hashedColorHex(name) {
    if (!name) return "FFFFFF";
    // FNV-1a 32-bit
    let hash = 0x811c9dc5 >>> 0;
    for (let i = 0; i < name.length; i++) {
        hash ^= name.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    // Produce 3 bytes from hash
    const r0 = (hash >>> 0) & 0xff;
    const g0 = (hash >>> 8) & 0xff;
    const b0 = (hash >>> 16) & 0xff;
    // Mix with white (255) to keep colors lighter like Python version
    const r = Math.floor((r0 + 255) / 2);
    const g = Math.floor((g0 + 255) / 2);
    const b = Math.floor((b0 + 255) / 2);
    return [r, g, b].map(v => v.toString(16).padStart(2, "0").toUpperCase()).join("");
}

// Pick text color (black/white) depending on background hex for readability
export function textColorForHex(hex) {
    // hex: "RRGGBB" or "#RRGGBB"
    const h = hex.replace("#", "");
    if (h.length !== 6) return "#000000";
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    // luminance (perceived)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 180 ? "#000000" : "#FFFFFF";
}

function chooseCandidates(players, week_index, already, stats, task_name, is_drive, preferences, rnd) {
    function score(p) {
        const ps = stats[p];
        const pref = (preferences[p] && Number(preferences[p][task_name])) ?? 2; // default 2
        return [
            is_drive ? ps.km : 0,           // minder km eerst
            ps.per_task[task_name] ?? 0,    // minder vaak die taak eerst
            ps.total_tasks,                 // minder totaal eerst
            -pref,                          // hogere voorkeur beter
            rnd(),                          // tie-breaker
        ];
    }

    const eligible = players.filter(p => !already.has(p) && ((preferences[p] && preferences[p][task_name]) ?? 2) > 0);

    if (AVOID_CONSECUTIVE) {
        const non_consec = eligible.filter(p => stats[p].last_week_index === null || stats[p].last_week_index < week_index - 0);
        const consec = eligible.filter(p => !non_consec.includes(p));
        return [...non_consec.sort((a,b)=>cmpTuple(score(a), score(b))), ...consec.sort((a,b)=>cmpTuple(score(a), score(b)))];
    }
    return eligible.sort((a,b)=>cmpTuple(score(a), score(b)));
}

function cmpTuple(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] < b[i]) return -1;
        if (a[i] > b[i]) return 1;
    }
    return 0;
}

function assignForWeek(players, week_index, tasks_for_week, stats, distance_km_single, preferences, rnd) {
    const week_assignment = Object.fromEntries(tasks_for_week.map(([t]) => [t, []]));
    const already = new Set();

    for (const [task_name, count] of tasks_for_week) {
        const is_drive = task_name.toLowerCase() === "rijden";
        for (let k = 0; k < count; k++) {
            const candidates = chooseCandidates(players, week_index, already, stats, task_name, is_drive, preferences, rnd);
            if (!candidates.length) throw new Error(`Geen geschikte speler voor taak: ${task_name}`);

            let chosen = candidates.find(c => !week_assignment[task_name].includes(c));
            if (!chosen) {
                // fallback: minst belast
                chosen = [...players].sort((a,b)=>
                    cmpTuple([
                        stats[a].total_tasks, stats[a].per_task[task_name] ?? 0,
                    ], [
                        stats[b].total_tasks, stats[b].per_task[task_name] ?? 0,
                    ])
                )[0];
            }

            week_assignment[task_name].push(chosen);
            already.add(chosen);
            stats[chosen].per_task[task_name] = (stats[chosen].per_task[task_name] ?? 0) + 1;
            stats[chosen].total_tasks += 1;
            stats[chosen].last_week_index = week_index;
            if (is_drive) stats[chosen].km += Number(distance_km_single) * 2.0;
        }
    }
    return week_assignment;
}

export function buildSchedule(tasks, matches, players, distances, seed = 42) {
    // 1) Dates & sort
    const matches_enriched = matches.map(m => {
        const { d, s } = mkdate(m.jaar, m.maand, m.dag);
        return { ...m, _date: d, _dates: s, _isUit: parseBoolJaNee(m.isUit) };
    }).sort((a,b)=>a._date - b._date);

    // 2) Players
    const playerNames = players.map(p => String(p.displaynaam));
    if (new Set(playerNames).size !== playerNames.length) throw new Error("Displaynamen moeten uniek zijn.");
    const shuffledPlayers = shufflePlayers(playerNames, seed);

    // 3) Distances map
    const dmap = Object.fromEntries(distances.map(d => [String(d.club).trim(), Number(d.afstand_km)]));

    // 4) Tasks & stats
    const flatTasks = tasks.map(t => [String(t.taak), String(t.scope), Number(t.aantal)]);
    const taskNames = flatTasks.map(([name]) => name);
    const stats = Object.fromEntries(shuffledPlayers.map(p => [p, emptyStats(taskNames)]));

    // 5) Preferences
    const preferences = Object.fromEntries(players.map(p => [
        p.displaynaam,
        Object.fromEntries(taskNames.map(t => [t, Number((p.preferences && p.preferences[t]) ?? 2)])),
    ]));

    // 6) Build schedule rows
    const rows = [];
    const rng = mulberry32(seed);

    matches_enriched.forEach((m, idx) => {
        const isAway = !!m._isUit;
        const tegen = String(m.club);
        const distance_single = dmap[tegen] ?? 0;

        const tasks_for_week = [];
        for (const [name, scope, count] of flatTasks) {
            if (scope === "altijd" || (scope === "uit" && isAway) || (scope === "thuis" && !isAway)) {
                tasks_for_week.push([name, count]);
            }
        }

        const week_assignment = assignForWeek(
            shuffledPlayers, idx, tasks_for_week, stats, distance_single, preferences, rng
        );

        const base = {
            "Datum": m._dates,
            "Tegenstander": tegen,
            "Uit/Thuis": isAway ? "Uit" : "Thuis",
        };

        for (const [name, , count] of flatTasks) {
            const assigned = week_assignment[name] || [];
            for (let i = 0; i < count; i++) {
                base[`${name} ${i+1}`] = assigned[i] || "";
            }
        }
        rows.push(base);
    });

    // 7) Stats table
    const stat_rows = Object.entries(stats).map(([p, ps]) => {
        const r = {
            "Speler": p,
            "Totaal taken": ps.total_tasks,
            "Km": Math.round(ps.km * 10) / 10,
        };
        for (const t of taskNames) r[`${t} count`] = ps.per_task[t] ?? 0;
        return r;
    }).sort((a,b)=>cmpTuple([a["Totaal taken"], a["Km"], a["Speler"]],[b["Totaal taken"], b["Km"], b["Speler"]]));

    return { schedule: rows, stats: stat_rows };
}
