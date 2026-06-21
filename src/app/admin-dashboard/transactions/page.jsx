"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCreditCard, FiRefreshCw } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [status, setStatus] = useState("loading");

    const loadTransactions = async () => {
        try {
            setStatus("loading");

            const query = filterStatus ? `?status=${filterStatus}` : "";
            const result = await apiRequest(`/api/admin/transactions${query}`);

            setTransactions(result.data || []);
            setStatus("success");
        } catch {
            setTransactions([]);
            setStatus("error");
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Transactions
                </p>

                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Track every payment.
                </h1>

                <p className="recipehub-muted-text mt-3">
                    View user, amount, date, payment status, and transaction ID.
                </p>
            </div>

            <div className="rh-card rounded-[2rem] p-5">
                <div className="flex flex-col gap-3 md:flex-row">
                    <select
                        value={filterStatus}
                        onChange={(event) => setFilterStatus(event.target.value)}
                        className="select select-bordered flex-1 rounded-full"
                    >
                        <option value="">All Transactions</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    <button
                        onClick={loadTransactions}
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
                    <h2 className="text-2xl font-black">Transactions could not load.</h2>

                    <button
                        onClick={loadTransactions}
                        className="btn mt-5 rounded-full"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {status === "success" && transactions.length === 0 && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <FiCreditCard className="mx-auto text-5xl text-emerald-500" />

                    <h2 className="mt-4 text-2xl font-black">
                        No transactions yet.
                    </h2>

                    <p className="rh-muted mx-auto mt-2 max-w-xl">
                        Stripe is not connected yet, so this table will stay empty until
                        payment records are saved.
                    </p>
                </div>
            )}

            {status === "success" && transactions.length > 0 && (
                <div className="rh-card overflow-hidden rounded-[2rem]">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="text-sm">
                                    <th>User</th>
                                    <th>Recipe</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Transaction ID</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <p className="font-black">{item.userEmail}</p>
                                            <p className="text-xs opacity-60">{item.userId}</p>
                                        </td>

                                        <td>
                                            {item.recipeId?._id ? (
                                                <Link
                                                    href={`/recipes/${item.recipeId._id}`}
                                                    className="font-black text-emerald-700 hover:underline"
                                                >
                                                    {item.recipeId.recipeName}
                                                </Link>
                                            ) : (
                                                <span className="font-bold opacity-60">
                                                    Premium Membership
                                                </span>
                                            )}
                                        </td>

                                        <td className="font-black">${item.amount}</td>

                                        <td>
                                            {item.paidAt
                                                ? new Date(item.paidAt).toLocaleDateString()
                                                : new Date(item.createdAt).toLocaleDateString()}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge font-bold ${item.paymentStatus === "paid"
                                                        ? "badge-success text-white"
                                                        : item.paymentStatus === "failed"
                                                            ? "badge-error text-white"
                                                            : "badge-warning"
                                                    }`}
                                            >
                                                {item.paymentStatus}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="font-mono text-xs">
                                                {item.transactionId}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}