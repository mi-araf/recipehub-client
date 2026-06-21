"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiEye, FiRefreshCw, FiTrash2 } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

export default function AdminReportsPage() {
    const [reports, setReports] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [status, setStatus] = useState("loading");

    const loadReports = async () => {
        try {
            setStatus("loading");

            const query = filterStatus ? `?status=${filterStatus}` : "";
            const result = await apiRequest(`/api/admin/reports${query}`);

            setReports(result.data || []);
            setStatus("success");
        } catch {
            setReports([]);
            setStatus("error");
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

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

    const handleRemoveRecipe = async (reportId) => {
        const confirmed = window.confirm(
            "Remove the reported recipe permanently?"
        );

        if (!confirmed) return;

        try {
            await apiRequest(`/api/admin/reports/${reportId}/remove-recipe`, {
                method: "DELETE",
            });

            toast.success("Reported recipe removed");
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
                        <option value="resolved">Resolved</option>
                    </select>

                    <button
                        onClick={loadReports}
                        className="btn rounded-full border-0 bg-emerald-600 px-8 text-white hover:bg-emerald-700"
                    >
                        <FiRefreshCw />
                        Filter
                    </button>
                </div>
            </div>

            {status === "loading" && <div className="skeleton h-96 rounded-[2rem]" />}

            {status === "error" && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <h2 className="text-2xl font-black">Reports could not load.</h2>
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
                    {reports.map((report) => (
                        <div
                            key={report._id}
                            className="rh-card grid gap-4 rounded-[2rem] p-5 lg:grid-cols-[120px_1fr_auto]"
                        >
                            <img
                                src={report.recipeId?.recipeImage || "/placeholder.png"}
                                alt={report.recipeId?.recipeName || "Reported recipe"}
                                className="h-32 w-full rounded-3xl object-cover lg:h-full"
                            />

                            <div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="badge badge-error font-bold text-white">
                                        {report.reason}
                                    </span>

                                    <span className="badge badge-outline font-bold">
                                        {report.status}
                                    </span>
                                </div>

                                <h2 className="mt-3 text-2xl font-black">
                                    {report.recipeId?.recipeName || "Recipe already removed"}
                                </h2>

                                <p className="rh-muted mt-1 text-sm">
                                    Reported by {report.reporterEmail}
                                </p>

                                {report.recipeId?.authorEmail && (
                                    <p className="rh-muted mt-1 text-sm">
                                        Author: {report.recipeId.authorName} •{" "}
                                        {report.recipeId.authorEmail}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
                                {report.recipeId?._id && (
                                    <Link
                                        href={`/recipes/${report.recipeId._id}`}
                                        className="btn rh-outline-btn rounded-full"
                                    >
                                        <FiEye />
                                        View
                                    </Link>
                                )}

                                <button
                                    onClick={() => handleDismiss(report._id)}
                                    disabled={report.status !== "pending"}
                                    className="btn rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    <FiCheckCircle />
                                    Dismiss
                                </button>

                                <button
                                    onClick={() => handleRemoveRecipe(report._id)}
                                    disabled={report.status === "resolved"}
                                    className="btn rounded-full border-0 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                                >
                                    <FiTrash2 />
                                    Remove Recipe
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}