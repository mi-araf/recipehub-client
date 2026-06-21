"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiBookOpen,
    FiCreditCard,
    FiGrid,
    FiHeart,
    FiPlusCircle,
    FiShield,
    FiUser,
} from "react-icons/fi";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/providers/AuthProvider";
import { getInitial } from "@/lib/dashboardApi";

const dashboardLinks = [
    { label: "Overview", href: "/dashboard", icon: FiGrid },
    { label: "My Recipes", href: "/dashboard/my-recipes", icon: FiBookOpen },
    { label: "Add Recipe", href: "/dashboard/add-recipe", icon: FiPlusCircle },
    { label: "My Favorites", href: "/dashboard/favorites", icon: FiHeart },
    {
        label: "Purchased Recipes",
        href: "/dashboard/purchased-recipes",
        icon: FiCreditCard,
    },
    { label: "Profile", href: "/dashboard/profile", icon: FiUser },
    { label: "Premium", href: "/dashboard/premium", icon: FiShield },
];

function getUserInfo(user) {
    const name = user?.name || user?.email?.split("@")[0] || "RecipeHub User";
    const image = user?.image || "";
    return { name, image };
}

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const { user } = useAuth();
    const { name, image } = getUserInfo(user);

    const isActive = (href) =>
        href === "/dashboard" ? pathname === href : pathname.startsWith(href);

    return (
        <ProtectedRoute>
            <section className="rh-section py-8 lg:py-12">
                <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
                    <aside className="rh-card h-fit overflow-hidden rounded-[2rem] p-4 backdrop-blur">
                        <div className="recipehub-page-card mb-4 rounded-[1.6rem] p-5">
                            <div className="flex items-center gap-3">
                                <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-emerald-600 text-xl font-black text-white">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={name}
                                            referrerPolicy="no-referrer"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getInitial(name)
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                                        User Dashboard
                                    </p>
                                    <h2 className="truncate text-lg font-black">{name}</h2>
                                    <p className="truncate text-xs opacity-70">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="grid gap-2">
                            {dashboardLinks.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${active
                                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                                : "hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <div>{children}</div>
                </div>
            </section>
        </ProtectedRoute>
    );
}
