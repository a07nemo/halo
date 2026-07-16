"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Sparkles, Wand2, Plus, Trash2, Check, Copy } from "lucide-react";
import { SectionHeader, Spinner } from "@/components/ui";
import {
  api,
  PLATFORMS,
  platformLabel,
  platformColor,
  postStatusColor,
  titleCase,
} from "@/lib/ui";

export default function StudioPage() {
  const [tab, setTab] = useState<"ideas" | "caption">("ideas");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => api("/api/posts").then(setPosts).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader title="Content Studio" subtitle="Generate ideas and captions with Halo, then save them to your pipeline." />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="card p-5">
            <div className="mb-4 flex gap-1 rounded-xl bg-surface-2/60 p-1">
              <button
                onClick={() => setTab("ideas")}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === "ideas" ? "bg-halo-600 text-white" : "text-muted"}`}
              >
                Idea generator
              </button>
              <button
                onClick={() => setTab("caption")}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === "caption" ? "bg-halo-600 text-white" : "text-muted"}`}
              >
                Caption writer
              </button>
            </div>
            {tab === "ideas" ? <IdeaGenerator onSaved={load} /> : <CaptionWriter onSaved={load} />}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Content pipeline</h2>
            <span className="text-xs text-muted">{posts.length} items</span>
          </div>
          {loading ? (
            <Spinner />
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <PostRow key={p.id} post={p} onChange={load} />
              ))}
              {posts.length === 0 && (
                <div className="card p-8 text-center text-sm text-muted">
                  No content yet — generate something on the left.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IdeaGenerator({ onSaved }: { onSaved: () => void }) {
  const [platform, setPlatform] = useState("instagram");
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    setBusy(true);
    try {
      const res = await api("/api/ai/ideas", {
        method: "POST",
        body: JSON.stringify({ platform, topic, count: 6 }),
      });
      setIdeas(res.ideas);
    } finally {
      setBusy(false);
    }
  };

  const save = async (idea: string) => {
    await api("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title: idea, caption: "", platform, status: "idea" }),
    });
    onSaved();
  };

  return (
    <div>
      <label className="label">Platform</label>
      <select className="input mb-3" value={platform} onChange={(e) => setPlatform(e.target.value)}>
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>
            {platformLabel[p]}
          </option>
        ))}
      </select>
      <label className="label">Topic (optional)</label>
      <input
        className="input mb-4"
        placeholder="e.g. sustainable travel packing"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button className="btn-primary w-full" onClick={generate} disabled={busy}>
        <Sparkles size={16} /> {busy ? "Thinking…" : "Generate ideas"}
      </button>

      {ideas.length > 0 && (
        <ul className="mt-4 space-y-2">
          {ideas.map((idea, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl border border-border bg-surface-2/40 p-3">
              <span className="flex-1 text-sm">{idea}</span>
              <button
                onClick={() => save(idea)}
                className="shrink-0 rounded-lg p-1.5 text-halo-300 hover:bg-halo-600/20"
                title="Save to pipeline"
              >
                <Plus size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CaptionWriter({ onSaved }: { onSaved: () => void }) {
  const [platform, setPlatform] = useState("instagram");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("authentic and warm");
  const [brand, setBrand] = useState("");
  const [result, setResult] = useState<{ caption: string; hashtags: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!topic) return;
    setBusy(true);
    try {
      const res = await api("/api/ai/caption", {
        method: "POST",
        body: JSON.stringify({ platform, topic, tone, brand: brand || undefined }),
      });
      setResult({ caption: res.caption, hashtags: res.hashtags });
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!result) return;
    await api("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: topic,
        caption: result.caption,
        hashtags: result.hashtags,
        platform,
        status: "draft",
      }),
    });
    onSaved();
    setResult(null);
    setTopic("");
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.caption}\n\n${result.hashtags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Platform</label>
          <select className="input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {platformLabel[p]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tone</label>
          <input className="input" value={tone} onChange={(e) => setTone(e.target.value)} />
        </div>
      </div>
      <label className="label mt-3">Topic</label>
      <input
        className="input mb-3"
        placeholder="What's the post about?"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <label className="label">Brand partner (optional)</label>
      <input
        className="input mb-4"
        placeholder="Adds a compliant #ad disclosure"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <button className="btn-primary w-full" onClick={generate} disabled={busy || !topic}>
        <Wand2 size={16} /> {busy ? "Writing…" : "Write caption"}
      </button>

      {result && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2/40 p-4">
          <p className="whitespace-pre-wrap text-sm">{result.caption}</p>
          <p className="mt-2 text-sm text-halo-300">{result.hashtags}</p>
          <div className="mt-3 flex gap-2">
            <button className="btn-primary flex-1" onClick={save}>
              <Plus size={16} /> Save as draft
            </button>
            <button className="btn-ghost" onClick={copy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PostRow({ post, onChange }: { post: any; onChange: () => void }) {
  const [open, setOpen] = useState(false);

  const setStatus = async (status: string) => {
    await api(`/api/posts/${post.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    onChange();
  };
  const remove = async () => {
    await api(`/api/posts/${post.id}`, { method: "DELETE" });
    onChange();
  };

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <span className={`pill ${platformColor[post.platform]}`}>{platformLabel[post.platform]}</span>
        <button onClick={() => setOpen(!open)} className="min-w-0 flex-1 text-left">
          <div className="truncate text-sm font-medium">{post.title}</div>
        </button>
        <select
          value={post.status}
          onChange={(e) => setStatus(e.target.value)}
          className={`rounded-lg border-0 bg-transparent px-2 py-1 text-xs font-medium ${postStatusColor[post.status]}`}
        >
          {["idea", "draft", "scheduled", "published"].map((s) => (
            <option key={s} value={s} className="bg-surface text-ink">
              {titleCase(s)}
            </option>
          ))}
        </select>
        <button onClick={remove} className="rounded-lg p-1.5 text-muted hover:bg-red-500/15 hover:text-red-300">
          <Trash2 size={15} />
        </button>
      </div>
      {open && (post.caption || post.hashtags) && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="whitespace-pre-wrap text-sm text-muted">{post.caption || "No caption yet."}</p>
          {post.hashtags && <p className="mt-2 text-sm text-halo-300">{post.hashtags}</p>}
          {post.scheduledAt && (
            <p className="mt-2 text-xs text-muted">Scheduled: {format(new Date(post.scheduledAt), "PPp")}</p>
          )}
        </div>
      )}
    </div>
  );
}
