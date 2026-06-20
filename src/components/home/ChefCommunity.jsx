"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiAward, FiPlusCircle, FiUsers } from "react-icons/fi";
import { GiChefToque } from "react-icons/gi";
import Image from "next/image";

export default function ChefCommunity() {
    return (
        <section className="rh-section py-14">
            <div className="grid items-center gap-10 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55 }}
                    className="rh-card rounded-3xl p-5"
                >
                    <Image
                        width={1200} height={1200}
                        src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop"
                        alt="RecipeHub cooking community"
                        className="h-96 w-full rounded-3xl object-cover"
                    />

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl bg-white p-4 text-stone-950">
                            <FiUsers className="mb-3 text-emerald-600" size={23} />
                            <p className="text-sm font-black">Community</p>
                        </div>

                        <div className="rounded-3xl bg-white p-4 text-stone-950">
                            <FiAward className="mb-3 text-amber-500" size={23} />
                            <p className="text-sm font-black">Premium</p>
                        </div>

                        <div className="rounded-3xl bg-white p-4 text-stone-950">
                            <FiPlusCircle className="mb-3 text-rose-500" size={23} />
                            <p className="text-sm font-black">Create</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55 }}
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800">
                        <GiChefToque size={18} />
                        Creator kitchen
                    </div>

                    <h2 className="rh-title max-w-xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
                        Start with two recipes. Grow into a premium creator.
                    </h2>

                    <p className="rh-muted mt-6 max-w-xl text-lg leading-8">
                        The platform encourages quality recipes first. Users can publish up
                        to two recipes for free, then unlock unlimited publishing with a
                        premium membership.
                    </p>

                    <div className="mt-9 flex flex-wrap gap-4">
                        <Link
                            href="/dashboard/add-recipe"
                            className="btn rounded-full border-0 bg-emerald-600 px-7 font-black text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                        >
                            Add Recipe
                            <FiArrowRight size={18} />
                        </Link>

                        <Link
                            href="/register"
                            className="btn rh-outline-btn rounded-full px-7 font-black"
                        >
                            Join RecipeHub
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}