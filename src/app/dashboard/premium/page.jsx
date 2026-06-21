"use client";

import Link from "next/link";
import { FiCheckCircle, FiCreditCard, FiShield, FiStar } from "react-icons/fi";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying RecipeHub and saving favorite recipes.",
    badge: "Starter plan",
    icon: FiShield,
    highlight: false,
    features: [
      "Add up to 2 recipes",
      "Browse all public recipes",
      "Save favorite recipes",
      "Update profile name and image",
      "No premium profile badge",
    ],
    button: "You are on Free",
    disabled: true,
  },
  {
    name: "Plus",
    price: "$4.99",
    period: "month",
    description: "For active food lovers who want more room to publish.",
    badge: "Best for growing chefs",
    icon: FiStar,
    highlight: false,
    features: [
      "Add up to 15 recipes",
      "Priority recipe visibility",
      "Favorites and purchased recipe library",
      "Clean dashboard tracking",
      "Plus profile styling",
    ],
    button: "Plus Checkout Coming Soon",
    disabled: true,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "month",
    description: "Unlock the full RecipeHub experience with unlimited publishing.",
    badge: "Most powerful",
    icon: FiCreditCard,
    highlight: true,
    features: [
      "Unlimited add recipe",
      "Premium profile badge",
      "Better dashboard status",
      "Ready for Stripe membership checkout",
      "Perfect for serious recipe creators",
    ],
    button: "Stripe Checkout Coming Later",
    disabled: true,
  },
];

export default function PremiumPage() {
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
          Stripe is skipped for now, but the pricing section is ready. Users can
          clearly understand what happens with Free, Plus, and Premium.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;

          return (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${plan.highlight
                  ? "border-emerald-400 bg-linear-to-br from-emerald-600 via-emerald-500 to-lime-400 text-white shadow-emerald-500/25"
                  : "rh-card border-base-300/70"
                }`}
            >
              {plan.highlight && (
                <div className="absolute right-5 top-5 rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] backdrop-blur">
                  Popular
                </div>
              )}

              <div
                className={`grid size-14 place-items-center rounded-2xl ${plan.highlight
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  }`}
              >
                <Icon size={24} />
              </div>

              <p
                className={`mt-6 text-xs font-black uppercase tracking-[0.2em] ${plan.highlight ? "text-white/75" : "text-emerald-700"
                  }`}
              >
                {plan.badge}
              </p>

              <h2 className="mt-2 text-3xl font-black">{plan.name}</h2>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-black">{plan.price}</span>
                <span
                  className={`pb-2 text-sm font-bold ${plan.highlight ? "text-white/75" : "opacity-60"
                    }`}
                >
                  / {plan.period}
                </span>
              </div>

              <p
                className={`mt-4 text-sm leading-6 ${plan.highlight ? "text-white/85" : "rh-muted"
                  }`}
              >
                {plan.description}
              </p>

              <div className="mt-6 grid gap-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <FiCheckCircle
                      className={`mt-1 shrink-0 ${plan.highlight ? "text-white" : "text-emerald-500"
                        }`}
                    />
                    <span className="text-sm font-bold">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={plan.disabled}
                className={`btn mt-8 w-full rounded-full border-0 font-black ${plan.highlight
                    ? "bg-white text-emerald-700 hover:bg-white"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                  } disabled:opacity-80`}
              >
                {plan.button}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rh-card rounded-[2rem] p-6 text-center">
        <h2 className="text-2xl font-black">Payment integration note</h2>
        <p className="rh-muted mx-auto mt-2 max-w-2xl">
          Later we will connect Stripe Checkout. After successful payment, the
          server will save the transaction in the payments collection and update
          the user as premium.
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