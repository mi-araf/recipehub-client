import "./globals.css";
import Providers from "@/components/shared/Providers";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata = {
    title: "RecipeHub | Recipe Sharing Platform",
    description:
        "Create, share, discover, save, and purchase meaningful recipes.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <div className="recipehub-shell text-base-content">
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}