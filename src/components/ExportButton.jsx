import { useCallback } from "react";
import * as XLSX from "xlsx";

export default function ExportButton({ schedule, stats }) {
    const exportExcel = useCallback(() => {
        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.json_to_sheet(schedule);
        XLSX.utils.book_append_sheet(wb, ws1, "Schema");
        const ws2 = XLSX.utils.json_to_sheet(stats);
        XLSX.utils.book_append_sheet(wb, ws2, "Statistieken");
        XLSX.writeFile(wb, "schema.xlsx");
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
