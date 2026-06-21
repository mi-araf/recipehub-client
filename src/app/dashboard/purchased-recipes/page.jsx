"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCreditCard, FiEye } from "react-icons/fi";

import { apiRequest } from "@/lib/dashboardApi";

export default function PurchasedRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    apiRequest("/api/dashboard/purchased-recipes")
      .then((result) => {
        setRecipes(result.data || []);
        setStatus("success");
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  }, []);

  return (
    <div className="grid gap-6">
      <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
        <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
          Purchased Recipes
        </p>
        <h1 className="mt-2 text-3xl font-black lg:text-5xl">
          Your paid recipe library.
        </h1>
        <p className="recipehub-muted-text mt-3">
          This page is ready for Stripe data. For now, purchases stay empty until
          payment integration is connected.
        </p>
      </div>

      {status === "loading" && <div className="skeleton h-80 rounded-[2rem]" />}

      {status === "error" && (
        <div className="rh-card rounded-[2rem] p-8">
          <h2 className="text-2xl font-black">Purchased recipes could not load.</h2>
        </div>
      )}

      {status === "success" && recipes.length === 0 && (
        <div className="rh-card rounded-[2rem] p-10 text-center">
          <FiCreditCard className="mx-auto text-5xl text-emerald-500" />
          <h2 className="mt-4 text-2xl font-black">No purchased recipes yet.</h2>
          <p className="rh-muted mx-auto mt-2 max-w-xl">
            Stripe is skipped for now, so this page shows the correct empty
            state. Once payments are saved into the payments collection, recipes
            will appear here automatically.
          </p>
          <Link href="/recipes" className="btn mt-5 rounded-full border-0 bg-emerald-600 text-white">
            Browse Recipes
          </Link>
        </div>
      )}

      {status === "success" && recipes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <div key={recipe.paymentId} className="rh-card overflow-hidden rounded-[2rem]">
              <img
                src={recipe.recipeImage}
                alt={recipe.recipeName}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-black">{recipe.recipeName}</h2>
                <p className="rh-muted mt-1 text-sm">
                  Paid ${recipe.amount} • Transaction {recipe.transactionId}
                </p>
                <Link
                  href={`/recipes/${recipe._id}`}
                  className="btn rh-outline-btn mt-5 rounded-full"
                >
                  <FiEye />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
