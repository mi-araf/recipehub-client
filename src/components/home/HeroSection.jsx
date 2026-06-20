"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiBookOpen, FiStar } from "react-icons/fi";
import { GiChefToque, GiCookingPot, GiForkKnifeSpoon } from "react-icons/gi";
import Image from "next/image";
import { FaFireFlameCurved } from "react-icons/fa6";

export default function HeroSection() {
    return (
        <section className="rh-section pb-12 pt-8 lg:pb-18">
            <div className="rh-home-card overflow-hidden rounded-3xl px-6 py-14 sm:px-10 lg:px-16">
                <div className="grid min-h-140 items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                    >
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-900">
                            <FaFireFlameCurved size={18} />
                            Fresh ideas from real kitchens
                        </div>

                        <h1 className="rh-title max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
                            Share recipes that feel crafted, clear, and worth saving.
                        </h1>

                        <p className="rh-muted mt-6 max-w-xl text-lg leading-8">
                            RecipeHub helps food lovers publish recipes, discover new dishes,
                            save favorites, and build a trusted cooking collection.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                href="/recipes"
                                className="btn rounded-full border-0 bg-amber-400 px-7 font-black text-stone-950 shadow-lg shadow-amber-400/20 hover:bg-amber-500"
                            >
                                Browse Recipes
                                <FiArrowRight size={18} />
                            </Link>

                            <Link
                                href="/register"
                                className="btn rh-outline-btn rounded-full px-7 font-black"
                            >
                                Start Sharing
                            </Link>
                        </div>

                        <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
                            <div className="rh-card rounded-3xl p-5">
                                <p className="text-3xl font-black">2K+</p>
                                <p className="rh-muted mt-1 text-sm font-bold">Recipe ideas</p>
                            </div>

                            <div className="rh-card rounded-3xl p-5">
                                <p className="text-3xl font-black">35+</p>
                                <p className="rh-muted mt-1 text-sm font-bold">Cuisines</p>
                            </div>

                            <div className="rh-card rounded-3xl p-5">
                                <p className="text-3xl font-black">4.9</p>
                                <p className="rh-muted mt-1 text-sm font-bold">Avg rating</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
                        className="relative mx-auto w-full max-w-xl"
                    >
                        <div className="rh-card rounded-3xl p-5">
                            <Image
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
                                alt="Featured RecipeHub dish"
                                width={1200} height={800}
                                className="h-96 w-full rounded-3xl object-cover"
                            />

                            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-3xl bg-white p-4 text-stone-950">
                                    <FiStar className="mb-3 text-amber-500" size={22} />
                                    <p className="text-sm font-black">Featured</p>
                                    <p className="text-xs font-semibold text-stone-500">
                                        Editor picks
                                    </p>
                                </div>

                                <div className="rounded-3xl bg-white p-4 text-stone-950">
                                    <FiBookOpen className="mb-3 text-emerald-600" size={22} />
                                    <p className="text-sm font-black">Guided</p>
                                    <p className="text-xs font-semibold text-stone-500">
                                        Clear steps
                                    </p>
                                </div>

                                <div className="rounded-3xl bg-white p-4 text-stone-950">
                                    <GiForkKnifeSpoon className="mb-3 text-rose-500" size={22} />
                                    <p className="text-sm font-black">Curated</p>
                                    <p className="text-xs font-semibold text-stone-500">
                                        Real meals
                                    </p>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-5 top-10 grid size-16 place-items-center rounded-full bg-white text-emerald-600 shadow-xl"
                        >
                            <GiCookingPot size={30} />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}