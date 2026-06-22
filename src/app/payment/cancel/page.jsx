import Link from "next/link";
import { FiArrowLeft, FiCreditCard } from "react-icons/fi";

export default function PaymentCancelPage() {
    return (
        <section className="rh-section py-14">
            <div className="rh-card rounded-[2rem] p-10 text-center">
                <FiCreditCard className="mx-auto text-5xl text-amber-500" />

                <h1 className="mt-5 text-3xl font-black">Payment cancelled.</h1>

                <p className="rh-muted mx-auto mt-3 max-w-xl">
                    No worries. Your card was not charged. You can return to pricing and
                    try again anytime.
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Link href="/dashboard/premium" className="btn rounded-full border-0 bg-emerald-600 text-white">
                        Try Again
                    </Link>

                    <Link href="/" className="btn rh-outline-btn rounded-full">
                        <FiArrowLeft />
                        Back Home
                    </Link>
                </div>
            </div>
        </section>
    );
}