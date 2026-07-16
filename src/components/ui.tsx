"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "halo",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  accent?: "halo" | "cyan" | "emerald" | "amber";
}) {
  const ring: Record<string, string> = {
    halo: "from-halo-600/20 to-halo-600/5 text-halo-300",
    cyan: "from-cyan-600/20 to-cyan-600/5 text-cyan-300",
    emerald: "from-emerald-600/20 to-emerald-600/5 text-emerald-300",
    amber: "from-amber-600/20 to-amber-600/5 text-amber-300",
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
          <div className="mt-2 text-2xl font-semibold">{value}</div>
          {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
        </div>
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${ring[accent]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative z-10 w-full max-w-lg p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-2xl">✦</div>
      <div className="font-medium">{title}</div>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-halo-500" />
    </div>
  );
}
