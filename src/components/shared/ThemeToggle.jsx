"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("recipehub-theme") || "light";

        document.documentElement.setAttribute("data-theme", savedTheme);
        setTheme(savedTheme);
        setMounted(true);
    }, []);

    const handleToggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("recipehub-theme", nextTheme);
        setTheme(nextTheme);
    };

    if (!mounted) {
        return (
            <button
                type="button"
                className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/10"
                aria-label="Loading theme"
            />
        );
    }

    return (
        <button
            type="button"
            onClick={handleToggleTheme}
            className="group grid size-10 place-items-center rounded-full border border-white/10 bg-slate-900 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <FiSun size={18} className="text-amber-200" />
            ) : (
                <FiMoon size={18} className="text-emerald-200" />
            )}
        </button>
    );
}