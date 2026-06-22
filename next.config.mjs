/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.ibb.co",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "ibb.co",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "imgbb.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "**",
                port: "",
                pathname: "/**",
            },
        ],
    },

    async rewrites() {
        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        return [
            {
                source: "/api/auth/:path*",
                destination: `${apiUrl}/api/auth/:path*`,
            },
        ];
    },

    devIndicators: false,
};

export default nextConfig;