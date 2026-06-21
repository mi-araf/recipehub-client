"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";

export default function AdminRoute({ children }) {
    const router = useRouter();
    const { user, authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push("/login?redirect=/admin-dashboard");
            return;
        }

        if (user.role !== "admin") {
            router.push("/dashboard");
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <section className="rh-section py-12">
                <div className="skeleton h-96 rounded-[2rem]" />
            </section>
        );
    }

    if (!user || user.role !== "admin") {
        return null;
    }

    return children;
}