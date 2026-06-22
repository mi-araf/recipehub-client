"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FiAlertTriangle,
    FiBookOpen,
    FiFlag,
    FiShield,
    FiUsers,
} from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

const statCards = [
    {
        key: "totalUsers",
        label: "Total Users",
        icon: FiUsers,
        helper: "Registered RecipeHub accounts",
    },
    {
        key: "totalRecipes",
        label: "Total Recipes",
        icon: FiBookOpen,
        helper: "Recipes published by all users",
    },
    {
        key: "totalPremiumMembers",
        label: "Premium Members",
        icon: FiShield,
        helper: "Users with premium access",
    },
    {
        key: "totalReports",
        label: "Total Reports",
        icon: FiFlag,
        helper: "Community submitted reports",
    },
];

export default function AdminOverviewPage() {
    const [overview, setOverview] = useState(null);
    const [status, setStatus] = useState("loading");

    const loadOverview = async () => {
        try {
            setStatus("loading");

            const result = await apiRequest("/api/admin/overview");

            setOverview(result.data);
            setStatus("success");
        } catch {
            setOverview(null);
            setStatus("error");
        }
    };

    useEffect(() => {
        loadOverview();
    }, []);

    if (status === "loading") {
        return (
            <div className="grid gap-4">
                <div className="skeleton h-44 rounded-[2rem]" />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="skeleton h-36 rounded-[2rem]" />
                    ))}
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="rh-card rounded-[2rem] p-10 text-center">
                <h1 className="text-2xl font-black">
                    Admin overview could not load.
                </h1>

                <p className="rh-muted mt-2">
                    Make sure your account role is admin and the server is running.
                </p>

                <button
                    onClick={loadOverview}
                    className="btn mt-5 rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const { stats, recentUsers, recentReports } = overview;

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Admin Overview
                </p>

                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Welcome to the control kitchen.
                </h1>

                <p className="recipehub-muted-text mt-3 max-w-2xl">
                    Monitor users, recipes, premium members, and reports from one clean
                    admin dashboard.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div key={card.key} className="rh-card rounded-[2rem] p-6">
                            <div className="flex items-center justify-between gap-4">
                                <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <Icon size={22} />
                                </span>

                                <span className="text-4xl font-black">
                                    {stats?.[card.key] || 0}
                                </span>
                            </div>

                            <h3 className="mt-5 text-lg font-black">{card.label}</h3>
                            <p className="rh-muted mt-1 text-sm">{card.helper}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rh-card rounded-[2rem] p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black">Recent Users</h2>
                            <p className="rh-muted text-sm">
                                Latest registered users on RecipeHub.
                            </p>
                        </div>

                        <Link
                            href="/admin-dashboard/manage-users"
                            className="btn rh-outline-btn rounded-full"
                        >
                            Manage
                        </Link>
                    </div>

                    {recentUsers?.length === 0 ? (
                        <p className="rh-muted">No users yet.</p>
                    ) : (
                        <div className="grid gap-3">
                            {recentUsers?.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center gap-3 rounded-3xl border border-base-300/70 p-4"
                                >
                                    <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-emerald-600 font-black text-white">
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                referrerPolicy="no-referrer"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            user.name?.charAt(0)?.toUpperCase() || "U"
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-black">{user.name}</h3>
                                        <p className="truncate text-xs opacity-60">{user.email}</p>
                                    </div>

                                    <div className="flex flex-wrap justify-end gap-2">
                                        <span className="badge badge-outline font-bold">
                                            {user.role}
                                        </span>

                                        {user.isPremium && (
                                            <span className="badge badge-warning font-bold">
                                                Premium
                                            </span>
                                        )}

                                        {user.isBlocked && (
                                            <span className="badge badge-error font-bold text-white">
                                                Blocked
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rh-card rounded-[2rem] p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black">Recent Reports</h2>
                            <p className="rh-muted text-sm">
                                Latest reports waiting for admin review.
                            </p>
                        </div>

                        <Link
                            href="/admin-dashboard/reports"
                            className="btn rh-outline-btn rounded-full"
                        >
                            Review
                        </Link>
                    </div>

                    {recentReports?.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-base-300 p-8 text-center">
                            <FiAlertTriangle className="mx-auto text-4xl text-emerald-500" />
                            <h3 className="mt-3 text-xl font-black">No reports yet.</h3>
                            <p className="rh-muted mt-1">Everything looks clean.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {recentReports?.map((report) => (
                                <div
                                    key={report._id}
                                    className="rounded-3xl border border-base-300/70 p-4"
                                >
                                    <h3 className="font-black">
                                        {report.recipeId?.recipeName || "Recipe removed"}
                                    </h3>

                                    <p className="rh-muted mt-1 text-sm">
                                        {report.reason} • {report.reporterEmail}
                                    </p>

                                    <span className="badge badge-outline mt-3 font-bold">
                                        {report.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}