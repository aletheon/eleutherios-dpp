"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------- Types ---------- */
type GpEvent = {
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
  proof?: {
    mode?: "none" | "signed" | "anchored";
    tx_hash?: string | null;
  };
};

type TrendPoint = { d: string; count: number };

/* ---------- Helpers ---------- */
function eventsToTrend(events: GpEvent[]): TrendPoint[] {
  const map = new Map<string, number>(); // yyyy-mm-dd -> count
  for (const e of events) {
    const d = (e.created_at || "").slice(0, 10);
    if (!d) continue;
    map.set(d, (map.get(d) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([d, count]) => ({ d, count }))
    .sort((a, b) => (a.d < b.d ? -1 : 1));
}

function fmt(n: any) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return typeof n === "number" ? n.toString() : n;
}

/* ---------- Page ---------- */
export default function GpDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [events, setEvents] = useState<GpEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const m = await fetch("/api/events?metrics=1", { cache: "no-store" }).then((r) => r.json());
        const e = await fetch("/api/events", { cache: "no-store" }).then((r) => r.json());
        setMetrics(m.metrics || null);
        setEvents((e.events as GpEvent[]) || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const trend: TrendPoint[] = useMemo(() => eventsToTrend(events), [events]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">GP Service Dashboard</h1>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Follow-up kept %" value={fmt(metrics?.follow_up_kept_pct)} />
        <StatCard label="Antibiotic rate %" value={fmt(metrics?.antibiotic_rate_pct)} />
        <StatCard label="Avg TTFU (days)" value={fmt(metrics?.ttfu_days_avg)} />
        <StatCard label="Encounters" value={metrics?.encounters ?? "—"} />
      </div>

      {/* Trend */}
      <div className="w-full h-64 rounded-2xl border bg-white p-3">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">Loading…</div>
        ) : trend.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">No events yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <XAxis dataKey="d" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent events */}
      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>Time</Th>
              <Th>Event</Th>
              <Th>Patient Ref</Th>
              <Th>Proof</Th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr
                key={i}
                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}
              >
                <Td>{new Date(e.created_at).toLocaleString()}</Td>
                <Td className="font-medium">{e.event_type}</Td>
                <Td>{(e.payload?.patient_ref as string) || "—"}</Td>
                <Td>
                  <span className="inline-flex items-center gap-2">
                    <Badge>{e.proof?.mode || "none"}</Badge>
                    {e.proof?.tx_hash && (
                      <a
                        className="underline text-blue-600"
                        href={`https://polygonscan.com/tx/${e.proof.tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        view tx
                      </a>
                    )}
                  </span>
                </Td>
              </tr>
            ))}
            {events.length === 0 && !loading && (
              <tr>
                <Td colSpan={4}>
                  <div className="py-6 text-center text-gray-600">
                    No events yet — POST to /api/events to get started.
                  </div>
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- UI helpers (higher contrast + className support) ---------- */
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-gray-600 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1 text-gray-900">{value ?? "—"}</div>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-3 py-2 text-left text-gray-700 font-semibold ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  colSpan,
  className = "",
}: {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
}) {
  return (
    <td className={`px-3 py-2 text-gray-800 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full bg-gray-100 border text-gray-800 ${className}`}
    >
      {children}
    </span>
  );
}
