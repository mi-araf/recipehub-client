"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
    FiAlertTriangle,
    FiArrowLeft,
    FiClock,
    FiCreditCard,
    FiHeart,
    FiShoppingBag,
    FiStar,
    FiUser,
    FiX,
} from "react-icons/fi";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const reportReasons = ["Spam", "Offensive Content", "Copyright Issue"];


export default function RecipeDetailsPage() {
    const { id } = useParams();

    const [recipe, setRecipe] = useState(null);
    const [status, setStatus] = useState("loading");
    const [reportOpen, setReportOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("Spam");
    const [actionLoading, setActionLoading] = useState(false);

    const [user, setUser] = useState(null);
    const [authStatus, setAuthStatus] = useState("checking");
    const [hasLiked, setHasLiked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const loadRecipe = async () => {
        try {
            setStatus("loading");

            const response = await fetch(`${API_URL}/api/recipes/${id}`, {
                cache: "no-store",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to load recipe");
            }

            setRecipe(result.data);
            setStatus("success");
        } catch (error) {
            console.error("Recipe details error:", error);
            setStatus("error");
        }
    };

    const checkAuthAndInteractions = async () => {
        try {
            const userResponse = await fetch(`${API_URL}/api/users/me`, {
                credentials: "include",
                cache: "no-store",
            });

            const userResult = await userResponse.json();

            if (!userResponse.ok || !userResult.success) {
                setUser(null);
                setAuthStatus("guest");
                return;
            }

            setUser(userResult.data);
            setAuthStatus("authenticated");

            const interactionResponse = await fetch(
                `${API_URL}/api/recipes/${id}/interaction-status`,
                {
                    credentials: "include",
                    cache: "no-store",
                }
            );

            const interactionResult = await interactionResponse.json();

            if (interactionResponse.ok && interactionResult.success) {
                setHasLiked(interactionResult.data.hasLiked);
                setIsFavorited(interactionResult.data.isFavorited);
            }
        } catch (error) {
            console.error(error);
            setUser(null);
            setAuthStatus("guest");
        }
    };

    useEffect(() => {
        if (id) {
            loadRecipe();
            checkAuthAndInteractions();
        }
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like recipes");
            return;
        }

        try {
            setActionLoading(true);

            const response = await fetch(`${API_URL}/api/recipes/${id}/like`, {
                method: "PATCH",
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to update like");
            }

            setRecipe(result.data);
            setHasLiked(result.hasLiked);
            toast.success(result.message);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Could not update like");
        } finally {
            setActionLoading(false);
        }
    };

    const handleFavorite = async () => {
        if (!user) {
            toast.error("Please login to save favorites");
            return;
        }

        try {
            setActionLoading(true);

            const response = await fetch(`${API_URL}/api/favorites/${id}/toggle`, {
                method: "PATCH",
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to update favorite");
            }

            setIsFavorited(result.isFavorited);
            toast.success(result.message);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Could not update favorite");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReport = async () => {
        if (!user) {
            toast.error("Please login to report recipes");
            return;
        }

        try {
            setActionLoading(true);

            const response = await fetch(`${API_URL}/api/reports`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId: id,
                    reason: selectedReason,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to report recipe");
            }

            toast.success("Report submitted");
            setReportOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Could not submit report");
        } finally {
            setActionLoading(false);
        }
    };

    const handlePurchase = () => {
        if (!user) {
            toast.error("Please login to purchase this recipe");
            return;
        }

        toast("Stripe checkout will be connected later");
    };

    if (status === "loading") {
        return (
            <section className="rh-section py-14">
                <div className="rh-card rounded-3xl p-5">
                    <div className="skeleton h-96 rounded-3xl" />
                    <div className="mt-8 space-y-4">
                        <div className="skeleton h-10 w-80" />
                        <div className="skeleton h-5 w-full" />
                        <div className="skeleton h-5 w-2/3" />
                    </div>
                </div>
            </section>
        );
    }

    if (status === "error" || !recipe) {
        return (
            <section className="rh-section py-14">
                <div className="rh-card rounded-3xl p-10 text-center">
                    <h1 className="rh-title text-3xl font-black">Recipe not found.</h1>
                    <p className="rh-muted mt-3">
                        The recipe may have been removed or blocked.
                    </p>

                    <Link
                        href="/recipes"
                        className="btn mt-7 rounded-full border-0 bg-amber-400 px-7 font-black text-stone-950 hover:bg-amber-500"
                    >
                        <FiArrowLeft size={18} />
                        Back to Recipes
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="rh-section py-10 lg:py-14">
            <Link
                href="/recipes"
                className="mb-6 inline-flex items-center gap-2 text-sm font-black text-emerald-700 transition hover:gap-3"
            >
                <FiArrowLeft size={17} />
                Back to all recipes
            </Link>

            <div className="grid gap-8 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="rh-card rounded-3xl p-4"
                >
                    <Image
                        width={500} height={450}
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        className="h-96 w-full rounded-3xl object-cover"
                    />

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl bg-white p-4 text-stone-950">
                            <FiClock className="mb-3 text-emerald-600" size={22} />
                            <p className="text-sm font-black">{recipe.preparationTime}</p>
                            <p className="text-xs font-bold text-stone-500">Prep Time</p>
                        </div>

                        <div className="rounded-3xl bg-white p-4 text-stone-950">
                            <FiStar className="mb-3 text-amber-500" size={22} />
                            <p className="text-sm font-black">{recipe.difficultyLevel}</p>
                            <p className="text-xs font-bold text-stone-500">Difficulty</p>
                        </div>

                        <div className="rounded-3xl bg-white p-4 text-stone-950">
                            <FiHeart className="mb-3 text-rose-500" size={22} />
                            <p className="text-sm font-black">{recipe.likesCount || 0}</p>
                            <p className="text-xs font-bold text-stone-500">Likes</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.08 }}
                    className="rh-home-card rounded-3xl p-6 sm:p-8"
                >
                    <div className="mb-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase text-emerald-800">
                            {recipe.category}
                        </span>

                        <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase text-amber-800">
                            {recipe.cuisineType}
                        </span>
                    </div>

                    <h1 className="rh-title text-4xl font-black leading-tight tracking-tight md:text-5xl">
                        {recipe.recipeName}
                    </h1>

                    <p className="rh-muted mt-5 flex items-center gap-2 text-sm font-black">
                        <FiUser size={17} />
                        By {recipe.authorName}
                    </p>

                    {authStatus === "guest" && (
                        <div className="rh-card mt-8 rounded-3xl p-6 text-center">
                            <h3 className="rh-title text-2xl font-black">Login required</h3>

                            <p className="rh-muted mt-3 leading-7">
                                Please login to like this recipe, add it to favorites, report it, or
                                purchase it.
                            </p>

                            <Link
                                href={`/login?redirect=/recipes/${id}`}
                                className="btn mt-6 rounded-full border-0 bg-emerald-600 px-7 font-black text-white hover:bg-emerald-700"
                            >
                                Login to continue
                            </Link>
                        </div>
                    )}

                    {authStatus === "authenticated" && (
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <div className="rh-card rounded-3xl p-5">
                                <p className="rh-muted text-sm font-black uppercase tracking-widest">
                                    Like Count
                                </p>

                                <p className="rh-title mt-2 text-4xl font-black">
                                    {recipe.likesCount || 0}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleLike}
                                disabled={actionLoading}
                                className={`btn rounded-full border-0 font-black text-white ${hasLiked
                                        ? "bg-slate-900 hover:bg-slate-800"
                                        : "bg-rose-500 hover:bg-rose-600"
                                    }`}
                            >
                                <FiHeart size={18} />
                                {hasLiked ? "Remove Like" : "Like Recipe"}
                            </button>

                            <button
                                type="button"
                                onClick={handleFavorite}
                                disabled={actionLoading}
                                className={`btn rounded-full border-0 font-black text-white ${isFavorited
                                        ? "bg-slate-900 hover:bg-slate-800"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                            >
                                <FiStar size={18} />
                                {isFavorited ? "Remove Favorite" : "Add Favorite"}
                            </button>

                            <button
                                type="button"
                                onClick={handlePurchase}
                                className="btn rounded-full border-0 bg-amber-400 font-black text-stone-950 hover:bg-amber-500"
                            >
                                <FiCreditCard size={18} />
                                Purchase Recipe
                            </button>

                            <button
                                type="button"
                                onClick={() => setReportOpen(true)}
                                className="btn rh-outline-btn rounded-full font-black"
                            >
                                <FiAlertTriangle size={18} />
                                Report
                            </button>
                        </div>
                    )}

                    <div className="rh-card mt-8 rounded-3xl p-6">
                        <h2 className="rh-title mb-4 flex items-center gap-2 text-2xl font-black">
                            <FiShoppingBag size={22} />
                            Ingredients
                        </h2>

                        <ul className="space-y-3">
                            {(recipe.ingredients || []).map((ingredient) => (
                                <li
                                    key={ingredient}
                                    className="rh-muted flex items-start gap-3 font-bold"
                                >
                                    <span className="mt-2 size-2 rounded-full bg-emerald-600" />
                                    {ingredient}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>

            <div className="rh-card mt-8 rounded-3xl p-6 sm:p-8">
                <h2 className="rh-title text-3xl font-black">Instructions</h2>

                <p className="rh-muted mt-5 whitespace-pre-line text-lg leading-8">
                    {recipe.instructions}
                </p>
            </div>

            {reportOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rh-home-card w-full max-w-md rounded-3xl p-6"
                    >
                        <div className="flex items-start justify-between gap-5">
                            <div>
                                <h3 className="rh-title text-2xl font-black">
                                    Report this recipe
                                </h3>
                                <p className="rh-muted mt-2">
                                    Choose a reason. Admin will review this report later.
                                </p>
                            </div>

                            <button
                                type=". Admin will review this report laterbutton"
                                onClick={() => setReportOpen(false)}
                                className="grid size-10 place-items-center rounded-full bg-white text-stone-950"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="mt-6 grid gap-3">
                            {reportReasons.map((reason) => (
                                <label
                                    key={reason}
                                    className="rh-card flex cursor-pointer items-center gap-3 rounded-2xl p-4 font-black"
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={(event) => setSelectedReason(event.target.value)}
                                        className="radio radio-success"
                                    />
                                    {reason}
                                </label>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleReport}
                            disabled={actionLoading}
                            className="btn mt-6 w-full rounded-full border-0 bg-rose-500 font-black text-white hover:bg-rose-600"
                        >
                            Submit Report
                        </button>
                    </motion.div>
                </div>
            )}
        </section>
    );
}