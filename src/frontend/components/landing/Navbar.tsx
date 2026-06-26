"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Channels", href: "/#channels" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
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
            <Link
              href="/signin"
              className="hidden text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:block"
            >
              Sign in
            </Link>
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
    </>
  );
}
