"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import HaloPortrait from "@/components/HaloPortrait";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

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
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (res?.error) {
      setError("That email and password don't match. Try again?");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
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
          <h1 className="mt-4 text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Halo's been keeping things tidy for you.</p>
        </div>

        {googleEnabled && (
          <>
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="btn-ghost w-full"
            >
              Continue with Google
            </button>
            <div className="my-5 flex items-center gap-3 text-xs text-muted">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="text-halo-300 hover:underline">
            Create an account
          </Link>
        </p>
        <p className="mt-4 rounded-lg bg-surface-2/60 p-2 text-center text-xs text-muted">
          Demo: demo@halo.app · halo1234
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
