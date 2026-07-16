"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import HaloPortrait from "@/components/HaloPortrait";
import { api } from "@/lib/ui";

const SUGGESTIONS = [
  "Give me 3 post ideas for this week",
  "How should I price my next brand deal?",
  "Write a hook about sustainable travel",
  "What should I focus on to grow faster?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api("/api/chat").then((d) => {
      setMessages(d.messages);
      setAiEnabled(d.aiEnabled);
    });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    setInput("");
    setMessages((m) => [...m, { id: "tmp", role: "user", content }]);
    setBusy(true);
    try {
      const res = await api("/api/chat", { method: "POST", body: JSON.stringify({ content }) });
      setMessages((m) => [...m, res.message]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="shrink-0"><HaloPortrait size={44} showTag={false} /></div>
        <div>
          <h1 className="text-lg font-semibold text-ink">Halo Chat</h1>
          <p className="text-xs text-muted">
            {aiEnabled ? "Powered by Claude · knows your deals & calendar" : "Demo mode — add ANTHROPIC_API_KEY for full replies"}
          </p>
        </div>
      </div>

      <div className="card flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div key={m.id + i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-gradient-to-br from-c1 to-c3 text-white"
                  : "border border-border bg-surface-2/60 text-ink"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-border bg-surface-2/60 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} className="btn-ghost text-xs">
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          className="input"
          placeholder="Ask Halo anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-primary px-4" disabled={busy || !input.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
