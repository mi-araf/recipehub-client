"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiStar, FiTrash2 } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";
import { useAuth } from "@/providers/AuthProvider";

export default function RatingBox({ recipeId }) {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        averageRating: 0,
        totalRatings: 0,
        reviews: [],
    });
    const [myRating, setMyRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    const selectedRating = hoverRating || myRating;

    const loadRatings = async () => {
        const result = await apiRequest(`/api/ratings/${recipeId}`);
        setStats(result.data);
    };

    const loadMyRating = async () => {
        if (!user) return;

        try {
            const result = await apiRequest(`/api/ratings/${recipeId}/me`);

            if (result.data) {
                setMyRating(result.data.rating || 0);
                setReview(result.data.review || "");
            }
        } catch {
            setMyRating(0);
            setReview("");
        }
    };

    useEffect(() => {
        if (!recipeId) return;

        loadRatings().catch(() => { });
        loadMyRating();
    }, [recipeId, user]);

    const handleSubmitRating = async () => {
        if (!user) {
            toast.error("Please login to rate this recipe");
            return;
        }

        if (!myRating) {
            toast.error("Please select a rating first");
            return;
        }

        try {
            setLoading(true);

            await apiRequest(`/api/ratings/${recipeId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rating: myRating,
                    review,
                }),
            });

            toast.success("Rating saved");
            await loadRatings();
            await loadMyRating();
        } catch (error) {
            toast.error(error.message || "Could not save rating");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveRating = async () => {
        try {
            setLoading(true);

            await apiRequest(`/api/ratings/${recipeId}`, {
                method: "DELETE",
            });

            setMyRating(0);
            setReview("");
            toast.success("Rating removed");
            await loadRatings();
        } catch (error) {
            toast.error(error.message || "Could not remove rating");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rh-card rounded-[2rem] p-6">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div>
                    <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.2em]">
                        Recipe Rating
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                        {stats.averageRating || 0}
                        <span className="text-base font-bold opacity-60"> / 5</span>
                    </h2>

                    <p className="rh-muted mt-1 text-sm">
                        Based on {stats.totalRatings || 0} rating
                        {stats.totalRatings === 1 ? "" : "s"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setMyRating(star)}
                            className={`grid size-11 place-items-center rounded-full border text-xl transition ${selectedRating >= star
                                    ? "border-amber-400 bg-amber-100 text-amber-500 shadow-lg shadow-amber-500/20"
                                    : "border-base-300 text-base-content/35 hover:border-amber-300 hover:text-amber-400"
                                }`}
                            aria-label={`Rate ${star} stars`}
                        >
                            <FiStar className={selectedRating >= star ? "fill-current" : ""} />
                        </button>
                    ))}
                </div>
            </div>

            <textarea
                value={review}
                onChange={(event) => setReview(event.target.value)}
                placeholder="Write a short review..."
                className="textarea textarea-bordered mt-5 min-h-28 w-full rounded-2xl"
            />

            <div className="mt-4 flex flex-wrap gap-3">
                <button
                    onClick={handleSubmitRating}
                    disabled={loading}
                    className="btn rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700"
                >
                    {loading ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : (
                        <FiStar />
                    )}
                    Save Rating
                </button>

                {myRating > 0 && (
                    <button
                        onClick={handleRemoveRating}
                        disabled={loading}
                        className="btn rounded-full border-0 bg-red-500 px-8 font-black text-white hover:bg-red-600"
                    >
                        <FiTrash2 />
                        Remove
                    </button>
                )}
            </div>

            {stats.reviews?.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-black">Latest Reviews</h3>

                    <div className="mt-4 grid gap-3">
                        {stats.reviews.map((item) => (
                            <div
                                key={item._id}
                                className="rounded-3xl border border-base-300/70 p-4"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="font-black">{item.userName}</p>
                                    <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">
                                        ⭐ {item.rating}
                                    </p>
                                </div>

                                <p className="rh-muted mt-2 text-sm">{item.review}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}