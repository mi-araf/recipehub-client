"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GiChefToque } from "react-icons/gi";
import { PiSparkleFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { FiLogIn, FiMenu, FiUser, FiX, FiShield } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";

const PROFILE_HREF = "/dashboard/profile";

const publicLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Recipes", href: "/recipes" },
];

const protectedLinks = [
    { label: "Dashboard", href: "/dashboard", icon: RxDashboard },
    { label: "Profile", href: PROFILE_HREF, icon: FiUser },
];

const adminLinks = [
    { label: "Admin", href: "/admin-dashboard", icon: FiShield },
];

function getUserInfo(user) {
    const currentUser = user?.user || user || {};

    const name =
        currentUser?.name ||
        currentUser?.displayName ||
        currentUser?.email?.split("@")[0] ||
        "Chef";

    const image =
        currentUser?.image ||
        currentUser?.imageUrl ||
        currentUser?.photoURL ||
        currentUser?.avatar ||
        "";

    const initial = name?.trim()?.charAt(0)?.toUpperCase() || "U";

    return { name, image, initial };
}

function UserAvatar({ user, compact = false }) {
    const [imageError, setImageError] = useState(false);
    const { name, image, initial } = getUserInfo(user);
    const showImage = image && !imageError;

    return (
        <span
            className={`grid ${compact ? "size-9" : "size-11"
                } shrink-0 place-items-center overflow-hidden rounded-full border border-emerald-400/40 bg-linear-to-br from-emerald-500 to-amber-400 text-sm font-black uppercase text-white shadow-lg shadow-emerald-500/20`}
        >
            {showImage ? (
                <Image
                    width={40} height={40}
                    src={image}
                    alt={name}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span>{initial}</span>
            )}
        </span>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { user, authLoading } = useAuth();

    const isLoggedIn = Boolean(user);
    const { name } = getUserInfo(user);

    const isActive = (href) => {
        if (href === "/") return pathname === "/";

        if (href === "/admin-dashboard") {
            return pathname === "/admin-dashboard" || pathname.startsWith("/admin-dashboard/");
        }

        if (href === "/dashboard") {
            return (
                pathname === "/dashboard" ||
                (pathname.startsWith("/dashboard/") &&
                    !pathname.startsWith(PROFILE_HREF))
            );
        }

        if (href === PROFILE_HREF) {
            return pathname === PROFILE_HREF;
        }

        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 px-4 py-3">
            <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-[2rem] border border-base-300/70 bg-base-100/75 px-4 py-3 shadow-xl shadow-emerald-950/5 backdrop-blur-xl">
                <Link href="/" className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-linear-to-br from-emerald-500 to-amber-400 text-white shadow-lg shadow-emerald-500/25">
                        <GiChefToque className="text-2xl" />
                    </span>

                    <span className="leading-tight">
                        <span className="flex items-center gap-1 text-xl font-black tracking-tight">
                            Recipe
                            <span className="text-emerald-600">Hub</span>
                            <PiSparkleFill className="text-sm text-amber-400" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/50">
                            Cook • Share • Discover
                        </span>
                    </span>
                </Link>

                <div className="hidden items-center gap-1 lg:flex">
                    {publicLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {isLoggedIn &&
                        protectedLinks.map((link) => {
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`nav-link flex items-center gap-2 ${isActive(link.href) ? "nav-link-active" : ""
                                        }`}
                                >
                                    <Icon />
                                    {link.label}
                                </Link>
                            );
                        })}

                    {isLoggedIn &&
                        user?.role === "admin" &&
                        adminLinks.map((link) => {
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`nav-link flex items-center gap-2 ${isActive(link.href) ? "nav-link-active" : ""
                                        }`}
                                >
                                    <Icon />
                                    {link.label}
                                </Link>
                            );
                        })}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <ThemeToggle />

                    {authLoading ? (
                        <div className="h-11 w-44 animate-pulse rounded-full bg-base-300/60" />
                    ) : isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/dashboard"
                                className="btn hidden rounded-full border-0 bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 md:inline-flex lg:hidden"
                            >
                                <RxDashboard />
                                Dashboard
                            </Link>

                            <Link
                                href={PROFILE_HREF}
                                className="group flex items-center gap-3 rounded-full border border-base-300/70 bg-base-100/80 py-1 pl-1 pr-4 transition hover:border-emerald-400/60 hover:bg-emerald-50/80 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:bg-emerald-950/20"
                                title="Go to profile"
                            >
                                <UserAvatar user={user} />

                                <span className="hidden text-left leading-tight sm:block">
                                    <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-base-content/45">
                                        Welcome
                                    </span>
                                    <span className="block max-w-32 truncate text-sm font-extrabold text-base-content group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                                        {name}
                                    </span>
                                </span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="btn btn-ghost rounded-full">
                                <FiLogIn />
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="btn rounded-full border-0 bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700"
                            >
                                Join Free
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />

                    <button
                        onClick={() => setIsOpen((current) => !current)}
                        className="grid size-10 place-items-center rounded-full border border-base-300/70 bg-base-100/70"
                        aria-label="Open menu"
                    >
                        {isOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="mx-auto mt-3 max-w-7xl rounded-3xl border border-base-300/70 bg-base-100/95 p-3 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl md:hidden"
                    >
                        <div className="grid gap-2">
                            {authLoading ? (
                                <div className="h-14 animate-pulse rounded-2xl bg-base-300/60" />
                            ) : isLoggedIn ? (
                                <Link
                                    href={PROFILE_HREF}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-50/70 p-3 dark:bg-emerald-950/20"
                                >
                                    <UserAvatar user={user} compact />

                                    <span className="leading-tight">
                                        <span className="block text-sm font-extrabold">{name}</span>
                                        <span className="block text-xs font-semibold text-base-content/55">
                                            View profile
                                        </span>
                                    </span>
                                </Link>
                            ) : null}

                            {publicLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isLoggedIn &&
                                protectedLinks.map((link) => {
                                    const Icon = link.icon;

                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`nav-link flex items-center gap-2 ${isActive(link.href) ? "nav-link-active" : ""
                                                }`}
                                        >
                                            <Icon />
                                            {link.label}
                                        </Link>
                                    );
                                })}

                            {isLoggedIn &&
                                user?.role === "admin" &&
                                adminLinks.map((link) => {
                                    const Icon = link.icon;

                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`nav-link flex items-center gap-2 ${isActive(link.href) ? "nav-link-active" : ""
                                                }`}
                                        >
                                            <Icon />
                                            {link.label}
                                        </Link>
                                    );
                                })}

                            {!authLoading && !isLoggedIn && (
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="btn btn-ghost rounded-full"
                                    >
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
        </header>
    );
}