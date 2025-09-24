import { useCallback } from "react";
import * as XLSX from "xlsx";
import { hashedColorHex } from "../utils/scheduler";

export default function ExportButton({ schedule, stats }) {
    const exportExcel = useCallback(() => {
        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.json_to_sheet(schedule, { origin: "A1" });

        // FIXME: Styling provided by SheetsJS Pro
        const headers = schedule.length ? Object.keys(schedule[0]) : [];
        const nameColumns = headers.slice(3); // dynamic

        const range = XLSX.utils.decode_range(ws1['!ref']);
        const fills = {};

        // Collect colors for all players we see
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            for (let C = range.s.c + 3; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
                if (!ws1[cellRef]) continue;
                const player = ws1[cellRef].v;
                if (typeof player === "string" && player.trim() !== "") {
                    if (!fills[player]) fills[player] = hashedColorHex(player);
                }
            }
        }

        // Apply header formatting and fills
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const headerCellRef = XLSX.utils.encode_cell({ c: C, r: 0 });
            if (ws1[headerCellRef]) {
                ws1[headerCellRef].s = {
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }
        }

        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
                if (!ws1[cellRef]) continue;
                const header = headers[C];
                const val = ws1[cellRef].v;
                if (nameColumns.includes(header) && typeof val === "string" && fills[val]) {
                    const rgb = fills[val];
                    ws1[cellRef].s = {
                        fill: { patternType: "solid", fgColor: { rgb }, bgColor: { rgb } },
                        alignment: { horizontal: "center", vertical: "center" },
                    };
                } else if (C <= 2) {
                    ws1[cellRef].s = { alignment: { horizontal: "center", vertical: "center" } };
                }
            }
        }

        XLSX.utils.book_append_sheet(wb, ws1, "Schema");

        const ws2 = XLSX.utils.json_to_sheet(stats, { origin: "A1" });
        XLSX.utils.book_append_sheet(wb, ws2, "Statistieken");

        XLSX.writeFile(wb, "schema.xlsx", { bookType: "xlsx", cellStyles: true });
    }, [schedule, stats]);

    return (
        <button
            onClick={exportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow"
        >
            Exporteer naar Excel
        </button>
    );
}
