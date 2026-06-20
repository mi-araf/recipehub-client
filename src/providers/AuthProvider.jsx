"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const checkUser = async () => {
        try {
            setAuthLoading(true);

            const response = await fetch(`${API_URL}/api/jwt/me`, {
                credentials: "include",
                cache: "no-store",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setUser(null);
                return null;
            }

            setUser(result.data);
            return result.data;
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
            return null;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        await fetch(`${API_URL}/api/jwt/logout`, {
            method: "POST",
            credentials: "include",
        });

        setUser(null);
    };

    useEffect(() => {
        checkUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                authLoading,
                checkUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};