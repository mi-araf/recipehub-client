"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiBookOpen, FiHome } from "react-icons/fi";
import { GiChefToque, GiForkKnifeSpoon, GiTomato } from "react-icons/gi";

export default function NotFound() {
    return (
        <section className="section-container py-8 lg:py-12">
            <div className="recipehub-page-card overflow-hidden rounded-4xl px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                    >
                        <div className="mb-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-5 text-emerald-700">
                            <GiChefToque size={18} />
                            Error 404
                        </div>

                        <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
                            This recipe went off the menu.
                        </h1>

                        <p className="recipehub-muted-text mt-6 max-w-xl text-lg leading-8">
                            The page you are looking for may have been moved, deleted, or
                            never existed. Let&apos;s take you back to fresh recipes.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                href="/"
                                className="btn rounded-full border-0 bg-amber-400 px-7 font-black text-stone-950 shadow-lg shadow-amber-400/20 hover:bg-amber-500"
                            >
                                <FiArrowLeft size={18} />
                                Back Home
                            </Link>

                            <Link
                                href="/recipes"
                                className="btn recipehub-outline-btn rounded-full px-7 font-black"
                            >
                                <FiBookOpen size={18} />
                                Browse Recipes
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="relative mx-auto grid min-h-110 w-full max-w-xl place-items-center"
                    >
                        <div className="recipehub-soft-panel absolute inset-x-8 inset-y-2 rounded-4xl" />

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 grid size-76 place-items-center rounded-full bg-white shadow-2xl"
                        >
                            <div className="absolute size-64 rounded-full border-18 border-amber-100" />
                            <div className="absolute size-48 rounded-full border-8 border-amber-200" />

                            <div className="relative z-10 text-center text-stone-950">
                                <GiForkKnifeSpoon className="mx-auto mb-4 text-emerald-600" size={42} />
                                <p className="text-7xl font-black leading-none">404</p>
                                <p className="mt-3 text-sm font-black uppercase tracking-5 text-stone-500">
                                    Empty plate
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0], rotate: [0, 8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="recipehub-mini-card absolute left-4 top-8 grid size-14 place-items-center rounded-full shadow-xl"
                        >
                            <GiTomato size={28} className="text-red-500" />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -8, 0], rotate: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="recipehub-mini-card absolute bottom-10 right-8 grid size-16 place-items-center rounded-full shadow-xl"
                        >
                            <FiHome size={27} className="text-emerald-600" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}