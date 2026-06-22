"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiCheckCircle, FiCreditCard, FiHome } from "react-icons/fi";

import { useAuth } from "@/providers/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { checkUser } = useAuth();

  const [payment, setPayment] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/payments/verify-session?session_id=${sessionId}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Payment verification failed");
        }

        setPayment(result.data);
        await checkUser();

        toast.success("Payment successful", {
          id: "payment-success",
        });

        setStatus("success");
      } catch (error) {
        toast.error(error.message || "Could not verify payment");
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId, checkUser]);

  if (status === "loading") {
    return (
      <section className="rh-section py-14">
        <div className="rh-card rounded-[2rem] p-10 text-center">
          <span className="loading loading-spinner loading-lg text-success" />
          <h1 className="mt-6 text-3xl font-black">
            Confirming your payment...
          </h1>
          <p className="rh-muted mt-3">
            Please wait while we save your transaction.
          </p>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="rh-section py-14">
        <div className="rh-card rounded-[2rem] p-10 text-center">
          <h1 className="text-3xl font-black">Payment verification failed.</h1>
          <p className="rh-muted mt-3">
            Please login again or check your transaction from dashboard.
          </p>

          <Link href="/dashboard/premium" className="btn mt-6 rounded-full">
            Back to Pricing
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rh-section py-14">
      <div className="recipehub-page-card rounded-[2rem] p-8 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-[1.5rem] bg-emerald-100 text-emerald-700">
          <FiCheckCircle size={42} />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
          Payment Success
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Your transaction is saved.
        </h1>

        <p className="recipehub-muted-text mx-auto mt-3 max-w-2xl">
          Thank you! Your payment was confirmed and stored in the payments
          collection.
        </p>

        <div className="rh-card mx-auto mt-8 max-w-lg rounded-[2rem] p-6 text-left">
          <p className="font-black">Transaction ID</p>
          <p className="mt-1 break-all text-sm opacity-70">
            {payment?.transactionId}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-base-200/70 p-4">
              <p className="text-xs font-black uppercase opacity-60">Amount</p>
              <p className="mt-1 text-2xl font-black">
                ${payment?.amount}
              </p>
            </div>

            <div className="rounded-2xl bg-base-200/70 p-4">
              <p className="text-xs font-black uppercase opacity-60">Type</p>
              <p className="mt-1 text-2xl font-black capitalize">
                {payment?.paymentType}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn rounded-full border-0 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <FiHome />
            Home
          </Link>

          <Link href="/dashboard/purchased-recipes" className="btn rh-outline-btn rounded-full">
            <FiCreditCard />
            Purchased Recipes
          </Link>

          <Link href="/dashboard/profile" className="btn rh-outline-btn rounded-full">
            Profile
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="rh-section py-14">
          <div className="rh-card rounded-[2rem] p-10 text-center">
            <span className="loading loading-spinner loading-lg text-success" />
          </div>
        </section>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}