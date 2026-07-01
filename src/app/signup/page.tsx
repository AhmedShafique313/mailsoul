"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, Mail, Sparkles, User } from "lucide-react";
import { signIn, signUp } from "@/frontend/lib/auth-client";

async function handleGoogleSignUp() {
  await signIn.social({ provider: "google", callbackURL: "/dashboard" });
}

async function handleYahooSignUp() {
  await signIn.oauth2({ providerId: "yahoo", callbackURL: "/dashboard" });
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    setSubmitting(true);
    setError("");

    const { error: signUpError } = await signUp.email({
      name,
      email,
      password,
    });

    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message ?? "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#05050a] px-4 py-6 text-white sm:px-6">
      <div
        aria-hidden
        className="absolute inset-x-0 top-[-12rem] -z-10 flex justify-center blur-3xl"
      >
        <div className="animate-blob h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-violet-600/40 via-fuchsia-500/30 to-cyan-400/30" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.15),transparent_60%)]"
      />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center py-4">
        <Link href="/" className="mb-4 flex items-center gap-2 sm:mb-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/30">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            Mailsoul
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full"
        >
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-cyan-400/20 blur-2xl" />

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 sm:mb-6">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Private beta
            </div>

            <h1 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Claim your inbox.
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Create your Mailsoul account and bring every inbox into one
              voice.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-8 text-center"
                >
                  <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                  <p className="text-sm font-medium text-emerald-200">
                    You&apos;re in, {name.split(" ")[0] || "there"}. Taking
                    you back to Mailsoul now.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="mt-5 flex flex-col gap-3"
                >
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-zinc-400">
                      Full name
                    </span>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-violet-400/50">
                      <User className="h-4 w-4 shrink-0 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Priya Sharma"
                        className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-zinc-400">
                      Email
                    </span>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-violet-400/50">
                      <Mail className="h-4 w-4 shrink-0 text-zinc-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-zinc-400">
                      Password
                    </span>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-violet-400/50">
                      <Lock className="h-4 w-4 shrink-0 text-zinc-500" />
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                      />
                    </div>
                  </label>

                  {error && (
                    <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs text-red-300">
                      {error}
                    </p>
                  )}

                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.97 }}
                    type="submit"
                    disabled={submitting}
                    className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-violet-500/30 disabled:opacity-60"
                  >
                    {submitting ? "Creating your account..." : "Create my account"}
                    {!submitting && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </motion.button>

                  <div className="my-1 flex items-center gap-3 text-xs text-zinc-500">
                    <span className="h-px flex-1 bg-white/10" />
                    or continue with
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleGoogleSignUp}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-red-400 to-amber-300" />
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={handleYahooSignUp}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-300" />
                      Yahoo
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-4 text-center text-xs text-zinc-500">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-zinc-300 hover:text-white">
                terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-zinc-300 hover:text-white">
                privacy policy
              </Link>
              .
            </p>
          </div>

          <p className="mt-4 text-center text-sm text-zinc-400">
            Have questions first?{" "}
            <Link
              href="/#contact"
              className="font-medium text-violet-300 hover:text-violet-200"
            >
              Talk to us
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
