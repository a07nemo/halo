"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import HaloPortrait from "@/components/HaloPortrait";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((p) => setGoogleEnabled(Boolean(p?.google)))
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Something went wrong. Try again?");
      setBusy(false);
      return;
    }
    // auto sign-in
    await signIn("credentials", { email, password, redirect: false });
    router.push("/onboarding");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <HaloPortrait size={72} />
          <h1 className="mt-4 text-2xl font-semibold">Let's get you set up</h1>
          <p className="mt-1 text-sm text-muted">Create your account and meet Halo.</p>
        </div>

        {googleEnabled && (
          <>
            <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn-ghost w-full">
              Sign up with Google
            </button>
            <div className="my-5 flex items-center gap-3 text-xs text-muted">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maya Rivers" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-halo-300 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
