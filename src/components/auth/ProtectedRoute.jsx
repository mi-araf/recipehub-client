"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLock } from "react-icons/fi";
import { useAuth } from "@/providers/AuthProvider";

export default function ProtectedRoute({ children }) {
    const pathname = usePathname();
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <section className="rh-section py-20">
                <div className="rh-card rounded-3xl p-10 text-center">
                    <span className="loading loading-spinner loading-lg text-emerald-600" />
                    <p className="rh-muted mt-4 font-black">Checking authentication...</p>
                </div>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="rh-section py-20">
                <div className="rh-home-card mx-auto max-w-xl rounded-3xl p-8 text-center">
                    <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-600 text-white">
                        <FiLock size={28} />
                    </div>

                    <h1 className="rh-title text-4xl font-black">Private Route</h1>

                    <p className="rh-muted mt-4 leading-7">
                        You need to login before accessing this page.
                    </p>

                    <Link
                        href={`/login?redirect=${pathname}`}
                        className="btn mt-7 rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700"
                    >
                        Login to continue
                    </Link>
                </div>
            </section>
        );
    }

    return children;
}