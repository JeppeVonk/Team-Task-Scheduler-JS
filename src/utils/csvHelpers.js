// Generic CSV export/import helpers

export function exportCSV(filename, headers, rows) {
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ""}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

export async function importCSV(file) {
    if (!file) return [];

    const text = await file.text();
    const lines = text.trim().split("\n").map(l => l.split(",").map(s => s.replace(/(^"|"$)/g, "")));

    if (lines.length < 2) return [];

    const [, ...rows] = lines; // skip header
    return rows.filter(r => r.length > 1);
}
