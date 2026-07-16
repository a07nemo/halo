"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Check, Mail, DollarSign, ChevronDown, ChevronRight } from "lucide-react";
import { SectionHeader, Modal, Spinner, StatCard } from "@/components/ui";
import {
  api,
  fmtMoney,
  DEAL_STATUSES,
  dealStatusColor,
  deliverableStatusColor,
  titleCase,
} from "@/lib/ui";

const DELIVERABLE_TYPES = ["post", "reel", "story", "video", "ugc", "blog", "appearance"];
const DELIVERABLE_STATUSES = ["todo", "in_progress", "submitted", "approved"];

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = () => api("/api/deals").then(setDeals).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  if (loading) return <Spinner />;

  const totalPipeline = deals.filter((d) => !["archived", "paid"].includes(d.status)).reduce((s, d) => s + d.value, 0);
  const earned = deals.filter((d) => d.status === "paid").reduce((s, d) => s + d.value, 0);
  const openDeliverables = deals.flatMap((d) => d.deliverables).filter((d: any) => d.status !== "approved").length;

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        title="Deals & PR"
        subtitle="Track brands, deliverables, and every dollar in your pipeline."
        action={
          <button className="btn-primary" onClick={() => setAdding(true)}>
            <Plus size={16} /> New deal
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pipeline value" value={fmtMoney(totalPipeline)} icon={<DollarSign size={18} />} accent="halo" />
        <StatCard label="Earned (paid)" value={fmtMoney(earned)} accent="emerald" />
        <StatCard label="Open deliverables" value={openDeliverables} accent="amber" />
      </div>

      <div className="mt-6 space-y-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onChange={load} />
        ))}
        {deals.length === 0 && (
          <div className="card p-10 text-center text-sm text-muted">No deals yet — add your first brand partnership.</div>
        )}
      </div>

      {adding && <AddDealModal onClose={() => setAdding(false)} onSaved={load} />}
    </div>
  );
}

function DealCard({ deal, onChange }: { deal: any; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [newDeliv, setNewDeliv] = useState("");

  const approved = deal.deliverables.filter((d: any) => d.status === "approved").length;
  const progress = deal.deliverables.length ? (approved / deal.deliverables.length) * 100 : 0;

  const setStatus = async (status: string) => {
    await api(`/api/deals/${deal.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    onChange();
  };
  const removeDeal = async () => {
    if (!confirm(`Delete the ${deal.brand} deal?`)) return;
    await api(`/api/deals/${deal.id}`, { method: "DELETE" });
    onChange();
  };
  const setDelivStatus = async (id: string, status: string) => {
    await api(`/api/deliverables/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    onChange();
  };
  const addDeliv = async () => {
    if (!newDeliv.trim()) return;
    await api("/api/deliverables", {
      method: "POST",
      body: JSON.stringify({ dealId: deal.id, title: newDeliv, type: "post" }),
    });
    setNewDeliv("");
    onChange();
  };
  const removeDeliv = async (id: string) => {
    await api(`/api/deliverables/${id}`, { method: "DELETE" });
    onChange();
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <button onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          {open ? <ChevronDown size={18} className="text-muted" /> : <ChevronRight size={18} className="text-muted" />}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold">{deal.brand}</span>
              <span className="text-sm text-emerald-300">{fmtMoney(deal.value, deal.currency)}</span>
            </div>
            <div className="text-xs text-muted">
              {approved}/{deal.deliverables.length} deliverables
              {deal.dueDate ? ` · due ${format(new Date(deal.dueDate), "MMM d")}` : ""}
            </div>
          </div>
        </button>

        <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-surface-2 sm:block">
          <div className="h-full rounded-full bg-halo-500" style={{ width: `${progress}%` }} />
        </div>

        <select
          value={deal.status}
          onChange={(e) => setStatus(e.target.value)}
          className={`rounded-lg border-0 px-2.5 py-1 text-xs font-medium ${dealStatusColor[deal.status]}`}
        >
          {DEAL_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-surface text-ink">
              {titleCase(s)}
            </option>
          ))}
        </select>
        <button onClick={removeDeal} className="rounded-lg p-1.5 text-muted hover:bg-red-500/15 hover:text-red-300">
          <Trash2 size={15} />
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface-2/30 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="label">Deliverables</div>
              <ul className="space-y-2">
                {deal.deliverables.map((d: any) => (
                  <li key={d.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface/60 p-2">
                    <button
                      onClick={() => setDelivStatus(d.id, d.status === "approved" ? "todo" : "approved")}
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        d.status === "approved" ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" : "border-border"
                      }`}
                    >
                      {d.status === "approved" && <Check size={12} />}
                    </button>
                    <span className="flex-1 text-sm">
                      {d.title}
                      {d.quantity > 1 && <span className="text-muted"> ×{d.quantity}</span>}
                    </span>
                    <span className="pill bg-surface-2 text-muted">{d.type}</span>
                    <select
                      value={d.status}
                      onChange={(e) => setDelivStatus(d.id, e.target.value)}
                      className={`rounded-md border-0 px-1.5 py-0.5 text-xs ${deliverableStatusColor[d.status]}`}
                    >
                      {DELIVERABLE_STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-surface text-ink">
                          {titleCase(s)}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => removeDeliv(d.id)} className="text-muted hover:text-red-300">
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <input
                  className="input"
                  placeholder="Add a deliverable…"
                  value={newDeliv}
                  onChange={(e) => setNewDeliv(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addDeliv()}
                />
                <button className="btn-ghost" onClick={addDeliv}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div>
              <div className="label">Details</div>
              <div className="space-y-2 text-sm">
                {deal.contactName && (
                  <div>
                    <span className="text-muted">Contact:</span> {deal.contactName}
                  </div>
                )}
                {deal.contactEmail && (
                  <a href={`mailto:${deal.contactEmail}`} className="flex items-center gap-1 text-halo-300 hover:underline">
                    <Mail size={13} /> {deal.contactEmail}
                  </a>
                )}
                {deal.startDate && (
                  <div>
                    <span className="text-muted">Start:</span> {format(new Date(deal.startDate), "MMM d, yyyy")}
                  </div>
                )}
                {deal.notes && <p className="rounded-lg bg-surface/60 p-2 text-muted">{deal.notes}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddDealModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    brand: "",
    value: "",
    status: "pitched",
    contactName: "",
    contactEmail: "",
    dueDate: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.brand) return;
    setBusy(true);
    try {
      await api("/api/deals", { method: "POST", body: JSON.stringify(form) });
      onSaved();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="New brand deal"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={save} disabled={busy || !form.brand}>
            Create deal
          </button>
        </>
      }
    >
      <label className="label">Brand</label>
      <input className="input mb-3" value={form.brand} onChange={(e) => set("brand", e.target.value)} autoFocus />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Value (USD)</label>
          <input className="input" type="number" value={form.value} onChange={(e) => set("value", e.target.value)} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
            {DEAL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {titleCase(s)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className="label">Contact name</label>
          <input className="input" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} />
        </div>
        <div>
          <label className="label">Contact email</label>
          <input className="input" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
        </div>
      </div>
      <label className="label mt-3">Due date</label>
      <input className="input mb-3" type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
      <label className="label">Notes</label>
      <textarea className="input" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
    </Modal>
  );
}
