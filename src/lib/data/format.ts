import { format } from "date-fns";

export function formatDate(ms: number | null | undefined, withTime = true) {
  if (!ms) return "—";
  return format(new Date(ms), withTime ? "MMM d, yyyy · HH:mm" : "MMM d, yyyy");
}

export function shortId(id: string | undefined, len = 8) {
  if (!id) return "—";
  return id.length > len * 2 ? `${id.slice(0, len)}…${id.slice(-4)}` : id;
}

export const TX_TYPE_LABEL: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer_in: "Received",
  transfer_out: "Sent",
  admin_credit: "Account credit",
  admin_debit: "Account debit",
};

/** Builds a CSV file in the browser and downloads it. */
export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0] ?? {});
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
