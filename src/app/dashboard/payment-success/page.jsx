"use client";

import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function PaymentSuccessPage() {
  return (
    <div className="recipehub-page-card rounded-[2rem] p-10 text-center">
      <FiCheckCircle className="mx-auto text-6xl text-emerald-500" />
      <h1 className="mt-5 text-3xl font-black lg:text-5xl">
        Payment success page ready.
      </h1>
      <p className="recipehub-muted-text mx-auto mt-3 max-w-xl">
        Stripe is skipped for now. Later, this page will confirm payment, save
        the transaction in the payments collection, and refresh premium status.
      </p>
      <Link
        href="/dashboard"
        className="btn mt-6 rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
