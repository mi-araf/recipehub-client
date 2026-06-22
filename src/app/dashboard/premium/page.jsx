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
        description: "Start cooking, saving, and sharing with basic access.",
        badge: "Starter Chef",
        icon: FiShield,
        highlight: false,
        tone: "free",
        slots: "2 recipe slots",
        features: [
            "Add up to 2 recipes",
            "Browse all public recipes",
            "Save favorites and bookmarks",
            "Rate recipes from other chefs",
            "Best for exploring RecipeHub",
        ],
        limitations: [
            "No premium badge",
            "No unlimited publishing",
        ],
    },
    {
        id: "plus",
        name: "Plus",
        price: "$4.99",
        period: "one-time payment",
        description: "A smooth upgrade for active home chefs.",
        badge: "Plus Chef",
        icon: FiStar,
        highlight: false,
        tone: "plus",
        slots: "40 recipe slots",
        features: [
            "Add up to 40 recipes",
            "Plus Chef profile badge",
            "Save payment transaction",
            "Great for regular recipe creators",
            "More room to grow your recipe collection",
        ],
        limitations: [
            "Not unlimited",
            "Upgrade to Premium for full access",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        price: "$9.99",
        period: "one-time payment",
        description: "The full RecipeHub creator experience.",
        badge: "Premium Chef",
        icon: FiZap,
        highlight: true,
        tone: "premium",
        slots: "Unlimited recipe slots",
        features: [
            "Unlimited add recipe",
            "Premium Chef profile badge",
            "Saved Stripe transaction",
            "Best for serious creators",
            "Unlock the highest publishing freedom",
        ],
        limitations: [],
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
                    const currentPlan = user?.premiumPlan || "free";

                    const isCurrent =
                        plan.id === "free"
                            ? currentPlan === "free" || !user?.isPremium
                            : currentPlan === plan.id;

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

                            <div
                                className={`mt-5 rounded-2xl px-4 py-3 text-center font-black ${plan.id === "premium"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : plan.id === "plus"
                                            ? "bg-sky-100 text-sky-800"
                                            : "bg-base-200 text-base-content/70"
                                    }`}
                            >
                                {plan.slots}
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

        </div>
    );
}