"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Channels", href: "/#channels" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#05050a]/70 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              Mailsoul
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSignInOpen(true)}
              className="hidden text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:block"
            >
              Sign in
            </button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/signup"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Claim your inbox
            </motion.a>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {signInOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6"
            onClick={() => setSignInOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a12] p-6 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSignInOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-violet-300">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                Sign in is coming soon
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Mailsoul is in private beta. Create your account now and we
                will have you signed in shortly.
              </p>
              <a
                href="/signup"
                onClick={() => setSignInOpen(false)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105"
              >
                Create your account
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
