"use client";

import { motion } from "framer-motion";
import { FiClock, FiStar } from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import { featuredRecipes } from "@/data/homeRecipes";
import Image from "next/image";

export default function FeaturedRecipes() {
    return (
        <section className="rh-section py-14">
            <SectionHeader
                eyebrow="Featured recipes"
                title="Handpicked recipes for today’s table."
                description="Featured recipes will later come from the admin featured section. For now, these cards show the required data structure."
            />

            <div className="grid gap-6 md:grid-cols-3">
                {featuredRecipes.map((recipe, index) => (
                    <motion.article
                        key={recipe.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.45, delay: index * 0.08 }}
                        className="rh-card group overflow-hidden rounded-3xl p-4"
                    >
                        <div className="overflow-hidden rounded-3xl">
                            <Image 
                                width={500}
                                height={500}
                                src={recipe.image}
                                alt={recipe.recipeName}
                                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                        </div>

                        <div className="p-3 pt-5">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800">
                                    {recipe.category}
                                </span>

                                <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                                    <FiStar size={15} />
                                    Featured
                                </span>
                            </div>

                            <h3 className="rh-title text-2xl font-black leading-tight">
                                {recipe.recipeName}
                            </h3>

                            <div className="rh-muted mt-4 flex flex-wrap items-center gap-4 text-sm font-bold">
                                <span>{recipe.cuisine}</span>
                                <span className="flex items-center gap-1">
                                    <FiClock size={15} />
                                    {recipe.preparationTime}
                                </span>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}