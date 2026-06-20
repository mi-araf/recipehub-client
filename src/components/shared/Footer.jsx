import Link from "next/link";
import { GiChefToque } from "react-icons/gi";
import { FaFacebookF, FaGithub, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Recipes", href: "/recipes" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: FaFacebookF },
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "X", href: "#", icon: FaXTwitter },
  { label: "GitHub", href: "#", icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="section-container pb-6 pt-14">
      <div className="glass-panel overflow-hidden rounded-[2rem]">
        <div className="grid gap-10 px-6 py-10 md:grid-cols-[1.25fr_0.9fr_1fr] lg:px-10">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
                <GiChefToque size={27} />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Recipe
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Hub
                  </span>
                </h2>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Culinary inspiration
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-300">
              A refined recipe-sharing platform for home chefs, food lovers,
              and culinary creators to publish, discover, save, and purchase
              meaningful recipes.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="grid size-10 place-items-center rounded-full border border-base-300/70 bg-base-100/60 text-slate-600 transition hover:-translate-y-1 hover:border-emerald-400 hover:text-emerald-600 dark:text-slate-300"
                  >
                    <Icon size={16} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-slate-500 transition hover:translate-x-1 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Contact
            </h3>

            <div className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-300">
              <p className="flex items-start gap-3">
                <FiMapPin size={18} className="mt-0.5 text-emerald-600" />
                Dhaka, Bangladesh
              </p>

              <p className="flex items-center gap-3">
                <FiMail size={18} className="text-emerald-600" />
                support@recipehub.dev
              </p>

              <p className="flex items-center gap-3">
                <FiPhone size={18} className="text-emerald-600" />
                +880 1700-000000
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                Premium recipes, curated collections, and chef-made inspiration
                in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-base-300/50 px-6 py-5 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} RecipeHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}