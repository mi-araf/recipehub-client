"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    FiCheckCircle,
    FiCreditCard,
    FiShield,
    FiStar,
    FiZap,
} from "react-icons/fi";

import { useAuth } from "@/providers/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const plans = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying RecipeHub.",
        badge: "Starter",
        icon: FiShield,
        highlight: false,
        features: [
            "Add up to 2 recipes",
            "Browse public recipes",
            "Save favorites",
            "No premium profile badge",
        ],
    },
    {
        id: "plus",
        name: "Plus",
        price: "$4.99",
        period: "one-time sandbox",
        description: "For active food lovers.",
        badge: "Smooth upgrade",
        icon: FiStar,
        highlight: false,
        features: [
            "Plus checkout with Stripe",
            "Saved transaction",
            "Better creator status",
            "Good for testing payments",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        price: "$9.99",
        period: "one-time sandbox",
        description: "Unlock the full RecipeHub experience.",
        badge: "Most powerful",
        icon: FiZap,
        highlight: true,
        features: [
            "Premium profile badge",
            "Unlimited add recipe",
            "Saved transaction",
            "Premium dashboard status",
        ],
    },
];

export default function PremiumPage() {
    const { user, checkUser } = useAuth();
    const [loadingPlan, setLoadingPlan] = useState("");

    const startCheckout = async (planId) => {
        if (planId === "free") return;

        if (!user) {
            toast.error("Please login first");
            return;
        }

        try {
            setLoadingPlan(planId);

            const response = await fetch(
                `${API_URL}/api/payments/create-premium-checkout-session`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ plan: planId }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Could not start checkout");
            }

            if (result.alreadyPremium) {
                toast.success(result.message || "You already have this plan");
                await checkUser();
                return;
            }

            window.location.href = result.url;
        } catch (error) {
            toast.error(error.message || "Checkout failed");
        } finally {
            setLoadingPlan("");
        }
    };

    return (
        <div className="grid gap-6">
            <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
                <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
                    Pricing
                </p>

                <h1 className="mt-2 text-3xl font-black lg:text-5xl">
                    Choose your RecipeHub plan.
                </h1>

                <p className="recipehub-muted-text mt-3 max-w-2xl">
                    Upgrade with Stripe sandbox checkout. Premium users unlock a special
                    badge and unlimited recipe publishing.
                </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
                {plans.map((plan) => {
                    const Icon = plan.icon;
                    const isCurrent =
                        plan.id === "free"
                            ? !user?.isPremium
                            : user?.isPremium && user?.premiumPlan === plan.id;

                    return (
                        <div
                            key={plan.id}
                            className={`rh-card relative overflow-hidden rounded-[2rem] p-6 ${plan.highlight
                                    ? "border-2 border-emerald-400 shadow-2xl shadow-emerald-500/10"
                                    : ""
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute right-5 top-5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black uppercase text-white">
                                    Popular
                                </div>
                            )}

                            <span className="grid size-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <Icon size={24} />
                            </span>

                            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                                {plan.badge}
                            </p>

                            <h2 className="mt-2 text-3xl font-black">{plan.name}</h2>

                            <div className="mt-4 flex items-end gap-1">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span className="pb-2 text-sm font-bold opacity-60">
                                    / {plan.period}
                                </span>
                            </div>

                            <p className="rh-muted mt-4">{plan.description}</p>

                            <div className="mt-6 grid gap-3">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <FiCheckCircle className="text-emerald-600" />
                                        <span className="font-bold">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => startCheckout(plan.id)}
                                disabled={plan.id === "free" || loadingPlan === plan.id}
                                className={`btn mt-8 w-full rounded-full border-0 font-black ${plan.id === "free"
                                        ? "bg-base-200 text-base-content/60"
                                        : plan.highlight
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                            : "bg-slate-950 text-white hover:bg-slate-800"
                                    }`}
                            >
                                {loadingPlan === plan.id ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Opening Stripe...
                                    </>
                                ) : isCurrent ? (
                                    "Current Plan"
                                ) : plan.id === "free" ? (
                                    "Free Plan"
                                ) : (
                                    <>
                                        <FiCreditCard />
                                        Checkout with Stripe
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="rh-card rounded-[2rem] p-6">
                <h2 className="text-2xl font-black">Sandbox testing note</h2>
                <p className="rh-muted mt-2">
                    Use Stripe test mode. For successful test payment, use card number{" "}
                    <span className="font-black">4242 4242 4242 4242</span>, any future
                    expiry date, and any 3-digit CVC.
                </p>

                <Link
                    href="/dashboard/add-recipe"
                    className="btn rh-outline-btn mt-5 rounded-full"
                >
                    Back to Add Recipe
                </Link>
            </div>
        </div>
    );
}