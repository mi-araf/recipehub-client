export default function SectionHeader({ eyebrow, title, description, align = "center" }) {
    const alignment = align === "left" ? "text-left" : "text-center mx-auto";

    return (
        <div className={`mb-10 max-w-2xl ${alignment}`}>
            <p className="rh-eyebrow mb-3 text-sm font-black uppercase tracking-widest">
                {eyebrow}
            </p>

            <h2 className="rh-title text-4xl font-black leading-tight tracking-tight md:text-5xl">
                {title}
            </h2>

            {description && (
                <p className="rh-muted mt-4 text-base leading-7 md:text-lg">
                    {description}
                </p>
            )}
        </div>
    );
}