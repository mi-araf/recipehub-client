"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAward, FiSave, FiUser } from "react-icons/fi";

import { apiRequest, getInitial } from "@/lib/dashboardApi";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfilePage() {
  const { user, checkUser } = useAuth();
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await apiRequest("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await checkUser();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const isPremium = Boolean(user?.isPremium);

  return (
    <div className="grid gap-6">
      <div className="recipehub-page-card rounded-[2rem] p-6 lg:p-8">
        <p className="rh-eyebrow text-sm font-black uppercase tracking-[0.22em]">
          Profile
        </p>
        <h1 className="mt-2 text-3xl font-black lg:text-5xl">
          Update your chef identity.
        </h1>
        <p className="recipehub-muted-text mt-3">
          Update your name and image. Premium users show a special badge.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rh-card rounded-[2rem] p-6 text-center">
          <div className="mx-auto grid size-32 place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-amber-400 text-5xl font-black text-white shadow-xl shadow-emerald-500/20">
            {formData.image ? (
              <img
                src={formData.image}
                alt={formData.name || "Profile"}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              getInitial(formData.name || user?.email || "User")
            )}
          </div>

          <h2 className="mt-5 text-2xl font-black">{formData.name || "User"}</h2>
          <p className="rh-muted mt-1">{user?.email}</p>

          <div
            className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${
              isPremium
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                : "bg-base-200 text-base-content/70"
            }`}
          >
            {isPremium ? <FiAward /> : <FiUser />}
            {isPremium ? "Premium Chef" : "Free Chef"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rh-card grid gap-5 rounded-[2rem] p-6">
          <label className="form-control">
            <span className="label-text mb-2 font-black">Name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered rounded-2xl"
              required
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-black">Image URL</span>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="input input-bordered rounded-2xl"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-black">Email</span>
            <input
              value={user?.email || ""}
              className="input input-bordered rounded-2xl opacity-70"
              disabled
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="btn rounded-full border-0 bg-emerald-600 px-8 font-black text-white hover:bg-emerald-700"
          >
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
