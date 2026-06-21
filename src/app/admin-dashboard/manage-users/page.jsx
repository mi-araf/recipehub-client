"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiLock, FiRefreshCw, FiSearch, FiUnlock } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";
import Image from "next/image";

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("loading");

    const loadUsers = async () => {
        try {
            setStatus("loading");

            const query = search ? `?search=${encodeURIComponent(search)}` : "";
            const result = await apiRequest(`/api/admin/users${query}`);

            setUsers(result.data || []);
            setStatus("success");
        } catch {
            setUsers([]);
            setStatus("error");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleStatus = async (userId, action) => {
        try {
            await apiRequest(`/api/admin/users/${userId}/${action}`, {
                method: "PATCH",
            });

            toast.success(action === "block" ? "User blocked" : "User unblocked");
            loadUsers();
        } catch (error) {
            toast.error(error.message || "Action failed");
        }
    };

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Manage Users
                </p>

                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Control user access.
                </h1>

                <p className="recipehub-muted-text mt-3">
                    View users, block suspicious accounts, and unblock users when needed.
                </p>
            </div>

            <div className="rh-card rounded-[2rem] p-5">
                <div className="flex flex-col gap-3 md:flex-row">
                    <label className="input input-bordered flex flex-1 items-center gap-2 rounded-full">
                        <FiSearch />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by name or email"
                            className="grow"
                        />
                    </label>

                    <button
                        onClick={loadUsers}
                        className="btn rounded-full border-0 bg-emerald-600 px-8 text-white hover:bg-emerald-700"
                    >
                        <FiRefreshCw />
                        Search
                    </button>
                </div>
            </div>

            {status === "loading" && <div className="skeleton h-96 rounded-[2rem]" />}

            {status === "error" && (
                <div className="rh-card rounded-[2rem] p-10 text-center">
                    <h2 className="text-2xl font-black">Users could not load.</h2>
                    <button onClick={loadUsers} className="btn mt-5 rounded-full">
                        Try Again
                    </button>
                </div>
            )}

            {status === "success" && (
                <div className="rh-card overflow-hidden rounded-[2rem]">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="text-sm">
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Premium</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="grid size-11 place-items-center overflow-hidden rounded-2xl bg-emerald-600 font-black text-white">
                                                    {user.image ? (
                                                        <Image
                                                            width={200} height={200}
                                                            src={user.image}
                                                            alt={user.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        user.name?.charAt(0)?.toUpperCase() || "U"
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-black">{user.name}</p>
                                                    <p className="text-xs opacity-60">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="badge badge-outline font-bold">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>
                                            {user.isPremium ? (
                                                <span className="badge badge-warning font-bold">
                                                    Premium
                                                </span>
                                            ) : (
                                                <span className="badge badge-ghost font-bold">Free</span>
                                            )}
                                        </td>

                                        <td>
                                            {user.isBlocked ? (
                                                <span className="badge badge-error font-bold text-white">
                                                    Blocked
                                                </span>
                                            ) : (
                                                <span className="badge badge-success font-bold text-white">
                                                    Active
                                                </span>
                                            )}
                                        </td>

                                        <td className="text-right">
                                            {user.isBlocked ? (
                                                <button
                                                    onClick={() => handleStatus(user._id, "unblock")}
                                                    className="btn btn-sm rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
                                                >
                                                    <FiUnlock />
                                                    Unblock
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatus(user._id, "block")}
                                                    className="btn btn-sm rounded-full border-0 bg-red-500 text-white hover:bg-red-600"
                                                >
                                                    <FiLock />
                                                    Block
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className="p-10 text-center">
                                <h2 className="text-2xl font-black">No users found.</h2>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}