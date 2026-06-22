"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiBarChart2,
    FiCreditCard,
    FiFlag,
    FiGrid,
    FiShield,
    FiUsers,
    FiUser,
} from "react-icons/fi";

import AdminRoute from "@/components/auth/AdminRoute";
import { useAuth } from "@/providers/AuthProvider";
import { getInitial } from "@/lib/dashboardApi";
import Image from "next/image";

const adminLinks = [
    { label: "Overview", href: "/admin-dashboard", icon: FiGrid },
    { label: "Manage Users", href: "/admin-dashboard/manage-users", icon: FiUsers },
    {
        label: "Manage Recipes",
        href: "/admin-dashboard/manage-recipes",
        icon: FiBarChart2,
    },
    { label: "Reports", href: "/admin-dashboard/reports", icon: FiFlag },
    {
        label: "Transactions",
        href: "/admin-dashboard/transactions",
        icon: FiCreditCard,
    },
    {
        label: "Profile",
        href: "/admin-dashboard/profile",
        icon: FiUser,
    },
];

export default function AdminDashboardLayout({ children }) {
    const pathname = usePathname();
    const { user } = useAuth();

    const isActive = (href) =>
        href === "/admin-dashboard" ? pathname === href : pathname.startsWith(href);

    return (
        <AdminRoute>
            <section className="rh-section py-8 lg:py-12">
                <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
                    <aside className="rh-card h-fit overflow-hidden rounded-[2rem] p-4">
                        <div className="recipehub-page-card mb-4 rounded-[1.6rem] p-5">
                            <div className="flex items-center gap-3">
                                <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-950 text-xl font-black text-white">
                                    {user?.image ? (
                                        <Image
                                            width={200} height={200}
                                            src={user.image}
                                            alt={user.name}
                                            referrerPolicy="no-referrer"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getInitial(user?.name || "Admin")
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                                        Admin Dashboard
                                    </p>
                                    <h2 className="truncate text-lg font-black">
                                        {user?.name || "Admin"}
                                    </h2>
                                    <p className="truncate text-xs opacity-70">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="grid gap-2">
                            {adminLinks.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${active
                                            ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                                            : "hover:bg-emerald-50 hover:text-emerald-700"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-4 rounded-3xl bg-emerald-50 p-4 text-emerald-900">
                            <div className="flex items-center gap-2 font-black">
                                <FiShield />
                                Admin Mode
                            </div>
                            <p className="mt-2 text-xs font-semibold opacity-70">
                                Manage users, recipes, reports, and payments safely.
                            </p>
                        </div>
                    </aside>

                    <div>{children}</div>
                </div>
            </section>
        </AdminRoute>
    );
}