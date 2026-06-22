"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FiCheckCircle,
    FiEye,
    FiRefreshCw,
    FiTrash2,
} from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

export default function AdminReportsPage() {
    const [reports, setReports] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [status, setStatus] = useState("loading");

    const loadReports = useCallback(async () => {
        try {
            setStatus("loading");

            const query = filterStatus ? `?status=${filterStatus}` : "";
            const result = await apiRequest(`/api/admin/reports${query}`);

            setReports(result.data || []);
            setStatus("success");
        } catch (error) {
            setReports([]);
            setStatus("error");
        }
    }, [filterStatus]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const handleDismiss = async (reportId) => {
        try {
            await apiRequest(`/api/admin/reports/${reportId}/dismiss`, {
                method: "PATCH",
            });

            toast.success("Report dismissed");
            loadReports();
        } catch (error) {
            toast.error(error.message || "Could not dismiss report");
        }
    };

    const handleRemoveRecipe = async (report) => {
        const message = report.recipeId?._id
            ? "Remove this reported recipe permanently?"
            : "This recipe is already removed. Mark this report as removed?";

        const confirmed = window.confirm(message);

        if (!confirmed) return;

        try {
            await apiRequest(`/api/admin/reports/${report._id}/remove-recipe`, {
                method: "DELETE",
            });

            toast.success(
                report.recipeId?._id
                    ? "Reported recipe removed"
                    : "Report marked as removed"
            );

            loadReports();
        } catch (error) {
            toast.error(error.message || "Could not remove recipe");
        }
    };

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Recipe Reports
                </p>

                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Review community reports.
                </h1>

                <p className="recipehub-muted-text mt-3">
                    Users can report spam, offensive content, or copyright issues.
                </p>
            </div>

            <div className="rh-card rounded-[2rem] p-5">
                <div className="flex flex-col gap-3 md:flex-row">
                    <select
                        value={filterStatus}
                        onChange={(event) => setFilterStatus(event.target.value)}
                        className="select select-bordered flex-1 rounded-full"
                    >
                        <option value="">All Reports</option>
                        <option value="pending">Pending</option>
                        <option value="dismissed">Dismissed</option>
                        <option value="removed">Removed</option>
                    </select>

                    <button
                        onClick={loadReports}
                        className="btn rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700"
                    >
                        <FiRefreshCw />
                        Filter
                    </button>
                </div>
            </div>

            {status === "loading" && (
                <div className="skeleton h-96 rounded-[2rem]" />
            )}

            {status === "error" && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <h2 className="text-2xl font-black">Reports could not load.</h2>

                    <p className="rh-muted mt-2">
                        Please check if the server is running.
                    </p>

                    <button onClick={loadReports} className="btn mt-5 rounded-full">
                        Try Again
                    </button>
                </div>
            )}

            {status === "success" && reports.length === 0 && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <h2 className="text-2xl font-black">No reports found.</h2>
                    <p className="rh-muted mt-2">Everything looks clean for now.</p>
                </div>
            )}

            {status === "success" && reports.length > 0 && (
                <div className="grid gap-4">
                    {reports.map((report) => {
                        const recipe = report.recipeId;
                        const isPending = report.status === "pending";
                        const isRemoved = report.status === "removed";
                        const hasRecipe = Boolean(recipe?._id);

                        return (
                            <div
                                key={report._id}
                                className="rh-card flex flex-col gap-5 rounded-[2rem] p-5 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-3xl bg-emerald-100 text-center text-xs font-black uppercase tracking-[0.12em] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        {recipe?.recipeImage ? (
                                            <img
                                                src={recipe.recipeImage}
                                                alt={recipe?.recipeName || "Reported recipe"}
                                                referrerPolicy="no-referrer"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="px-3">Removed Recipe</span>
                                        )}
                                    </div>

                                    <div>
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-rose-100 px-4 py-2 text-xs font-black text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                                {report.reason}
                                            </span>

                                            <span
                                                className={`rounded-full px-4 py-2 text-xs font-black capitalize ${report.status === "pending"
                                                        ? "border border-amber-300 text-amber-700 dark:text-amber-300"
                                                        : report.status === "dismissed"
                                                            ? "border border-sky-300 text-sky-700 dark:text-sky-300"
                                                            : "border border-red-300 text-red-700 dark:text-red-300"
                                                    }`}
                                            >
                                                {report.status}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-black">
                                            {recipe?.recipeName || "Recipe already removed"}
                                        </h2>

                                        <p className="mt-1 text-sm font-semibold opacity-70">
                                            Reported by {report.reporterEmail}
                                        </p>

                                        {recipe?.authorEmail && (
                                            <p className="mt-1 text-sm font-semibold opacity-60">
                                                Author: {recipe.authorName} • {recipe.authorEmail}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 lg:w-52 lg:grid-cols-1">
                                    {hasRecipe && (
                                        <Link
                                            href={`/recipes/${recipe._id}`}
                                            className="btn rh-outline-btn rounded-full"
                                        >
                                            <FiEye />
                                            View
                                        </Link>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleDismiss(report._id)}
                                        disabled={!isPending}
                                        className="btn rounded-full border-0 bg-emerald-600 font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FiCheckCircle />
                                        Dismiss
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRecipe(report)}
                                        disabled={isRemoved}
                                        className="btn rounded-full border-0 bg-red-500 font-black text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FiTrash2 />
                                        {isRemoved
                                            ? "Removed"
                                            : hasRecipe
                                                ? "Remove Recipe"
                                                : "Mark Removed"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}