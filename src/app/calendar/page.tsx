"use client";

import { useEffect, useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { SectionHeader, Modal, Spinner } from "@/components/ui";
import { api, eventTypeColor, titleCase } from "@/lib/ui";

const EVENT_TYPES = ["shoot", "meeting", "launch", "deadline", "appearance", "general"];

export default function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  const load = () =>
    Promise.all([api("/api/events"), api("/api/deals")]).then(([e, d]) => {
      setEvents(e);
      setDeals(d);
      setLoading(false);
    });
  useEffect(() => {
    load();
  }, []);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    const arr: Date[] = [];
    let d = start;
    while (d <= end) {
      arr.push(d);
      d = addDays(d, 1);
    }
    return arr;
  }, [cursor]);

  const eventsByDay = (day: Date) => events.filter((e) => isSameDay(new Date(e.startAt), day));

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        title="Calendar"
        subtitle="Shoots, meetings, launches, and deadlines — all in one place."
        action={
          <button className="btn-primary" onClick={() => setModalDate(new Date())}>
            <Plus size={16} /> Add event
          </button>
        }
      />

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{format(cursor, "MMMM yyyy")}</h2>
          <div className="flex items-center gap-1">
            <button className="btn-ghost px-2" onClick={() => setCursor(addMonths(cursor, -1))}>
              <ChevronLeft size={16} />
            </button>
            <button className="btn-ghost text-xs" onClick={() => setCursor(new Date())}>
              Today
            </button>
            <button className="btn-ghost px-2" onClick={() => setCursor(addMonths(cursor, 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="bg-surface py-2 text-xs font-medium text-muted">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const dayEvents = eventsByDay(day);
            const inMonth = isSameMonth(day, cursor);
            return (
              <button
                key={day.toISOString()}
                onClick={() => setModalDate(day)}
                className={`min-h-[92px] bg-surface p-1.5 text-left align-top transition-colors hover:bg-surface-2/60 ${
                  inMonth ? "" : "opacity-40"
                }`}
              >
                <div
                  className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isToday(day) ? "bg-halo-600 font-semibold text-white" : "text-muted"
                  }`}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className={`truncate rounded-md border px-1.5 py-0.5 text-[10px] ${eventTypeColor[e.type] || eventTypeColor.general}`}
                    >
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-muted">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {EVENT_TYPES.map((t) => (
            <span key={t} className={`pill border ${eventTypeColor[t]}`}>
              {titleCase(t)}
            </span>
          ))}
        </div>
      </div>

      {modalDate && (
        <AddEventModal
          date={modalDate}
          deals={deals}
          existing={eventsByDay(modalDate)}
          onClose={() => setModalDate(null)}
          onSaved={() => {
            load();
          }}
        />
      )}
    </div>
  );
}

function AddEventModal({
  date,
  deals,
  existing,
  onClose,
  onSaved,
}: {
  date: Date;
  deals: any[];
  existing: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("shoot");
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [dealId, setDealId] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!title) return;
    setBusy(true);
    const [h, m] = time.split(":").map(Number);
    const startAt = new Date(date);
    startAt.setHours(h || 0, m || 0, 0, 0);
    try {
      await api("/api/events", {
        method: "POST",
        body: JSON.stringify({ title, type, location, dealId: dealId || null, startAt }),
      });
      onSaved();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    await api(`/api/events/${id}`, { method: "DELETE" });
    onSaved();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={format(date, "EEEE, MMM d")}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={save} disabled={busy || !title}>
            Add event
          </button>
        </>
      }
    >
      {existing.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="label">On this day</div>
          {existing.map((e) => (
            <div key={e.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/40 p-2">
              <span className={`pill border ${eventTypeColor[e.type]}`}>{titleCase(e.type)}</span>
              <span className="flex-1 truncate text-sm">{e.title}</span>
              <span className="text-xs text-muted">{format(new Date(e.startAt), "p")}</span>
              <button onClick={() => remove(e.id)} className="text-xs text-red-300 hover:underline">
                remove
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="label">Title</label>
      <input className="input mb-3" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {titleCase(t)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Time</label>
          <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <label className="label mt-3">Location</label>
      <input className="input mb-3" value={location} onChange={(e) => setLocation(e.target.value)} />
      <label className="label">Link to deal (optional)</label>
      <select className="input" value={dealId} onChange={(e) => setDealId(e.target.value)}>
        <option value="">None</option>
        {deals.map((d) => (
          <option key={d.id} value={d.id}>
            {d.brand}
          </option>
        ))}
      </select>
    </Modal>
  );
}
