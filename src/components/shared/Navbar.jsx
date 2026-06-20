"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GiChefToque } from "react-icons/gi";
import { PiSparkleFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { FiLogIn, FiMenu, FiUser, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Recipes", href: "/recipes" },
];

const protectedLinks = [
  { label: "Dashboard", href: "/dashboard", icon: RxDashboard },
  { label: "Profile", href: "/profile", icon: FiUser },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Later we will replace this with Better Auth session.
  const user = null;

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 px-3 py-3"
    >
      <nav className="glass-panel section-container rounded-[1.6rem] px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative grid size-11 place-items-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
              <GiChefToque size={25} />
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-amber-400 shadow-sm">
                <PiSparkleFill size={10} className="text-amber-950" />
              </span>
            </div>

            <div className="leading-tight">
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Recipe
                <span className="text-emerald-600 dark:text-emerald-400">
                  Hub
                </span>
              </h1>
              <p className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:block">
                Cook • Share • Discover
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${
                  isActive(link.href) ? "nav-link-active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user &&
              protectedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${
                    isActive(link.href) ? "nav-link-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />

            {user ? (
              <Link
                href="/dashboard"
                className="btn rounded-full border-0 bg-slate-900 px-5 text-white hover:bg-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-200"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-ghost rounded-full px-5 font-bold text-slate-700 dark:text-slate-200"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="btn rounded-full border-0 bg-emerald-600 px-5 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="grid size-10 place-items-center rounded-full border border-base-300/70 bg-base-100/70"
              aria-label="Open menu"
            >
              {isOpen ? <FiX size={19} /> : <FiMenu size={19} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-4 grid gap-2 border-t border-base-300/50 pt-4">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`nav-link ${
                      isActive(link.href) ? "nav-link-active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {user &&
                  protectedLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`nav-link flex items-center gap-2 ${
                          isActive(link.href) ? "nav-link-active" : ""
                        }`}
                      >
                        <Icon size={16} />
                        {link.label}
                      </Link>
                    );
                  })}

                {!user && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="btn btn-ghost rounded-full"
                    >
                      <FiLogIn size={16} />
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="btn rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}