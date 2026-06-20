"use client";

import { motion } from "framer-motion";
import { FiBookOpen, FiCheckCircle, FiShield } from "react-icons/fi";
import SectionHeader from "./SectionHeader";

const items = [
    {
        icon: FiBookOpen,
        title: "Clear recipe publishing",
        description:
            "Structured recipe forms keep ingredients, instructions, cuisine, category, and time easy to understand.",
    },
    {
        icon: FiShield,
        title: "Moderated community",
        description:
            "Reports, admin review, blocking, and recipe moderation help keep the platform trustworthy.",
    },
    {
        icon: FiCheckCircle,
        title: "Premium-ready growth",
        description:
            "Normal users can start small, while premium members unlock unlimited recipe publishing.",
    },
];

export default function WhyRecipeHub() {
    return (
        <section className="rh-section py-14">
            <div className="rh-home-card rounded-3xl px-6 py-14 sm:px-10">
                <SectionHeader
                    eyebrow="Why RecipeHub"
                    title="Built for creators, readers, and admins."
                    description="A recipe platform should feel simple on the surface and organized behind the scenes."
                />

                <div className="grid gap-6 md:grid-cols-3">
                    {items.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                                className="rh-card rounded-3xl p-6"
                            >
                                <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                                    <Icon size={24} />
                                </div>

                                <h3 className="rh-title text-xl font-black">{item.title}</h3>

                                <p className="rh-muted mt-3 leading-7">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}