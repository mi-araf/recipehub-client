import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiHeart, FiShield } from "react-icons/fi";
import { IoFlameOutline } from "react-icons/io5";

export default function Home() {
    return (
        <section className="section-container py-16 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        <IoFlameOutline size={16} />
                        Fresh recipes from real food creators
                    </div>

                    <h1 className="max-w-3xl text-5xl font-black leading-[1.04] tracking-tight text-slate-950 dark:text-white md:text-6xl">
                        Share recipes that feel personal, polished, and unforgettable.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                        RecipeHub helps food lovers publish recipes, discover new cuisines,
                        save favorites, report issues, and unlock premium recipe experiences.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/recipes"
                            className="btn rounded-full border-0 bg-emerald-600 px-7 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                        >
                            Browse Recipes
                            <FiArrowRight size={18} />
                        </Link>

                        <Link
                            href="/register"
                            className="btn rounded-full border border-base-300 bg-base-100/70 px-7"
                        >
                            Start Sharing
                        </Link>
                    </div>
                </div>

                <div className="glass-panel relative rounded-[2rem] p-5">
                    <div className="rounded-[1.5rem] bg-linear-to-br from-emerald-100 via-amber-50 to-white p-5 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-950">
                        <Image 
                            src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=1200&auto=format&fit=crop"
                            alt="RecipeHub featured dish"
                            width={400} height={400}
                            className="h-90 w-full rounded-[1.25rem] object-cover shadow-2xl" />

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white/75 p-4 dark:bg-white/10">
                                <FiHeart className="mb-3 text-rose-500" size={22} />
                                <p className="text-sm font-black">Favorites</p>
                                <p className="text-xs text-slate-500 dark:text-slate-300">
                                    Save recipes
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/75 p-4 dark:bg-white/10">
                                <IoFlameOutline className="mb-3 text-amber-500" size={22} />
                                <p className="text-sm font-black">Popular</p>
                                <p className="text-xs text-slate-500 dark:text-slate-300">
                                    Most liked
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/75 p-4 dark:bg-white/10">
                                <FiShield className="mb-3 text-emerald-600" size={22} />
                                <p className="text-sm font-black">Premium</p>
                                <p className="text-xs text-slate-500 dark:text-slate-300">
                                    Unlimited posts
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}