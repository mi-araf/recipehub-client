"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const checkUser = async () => {
        try {
            setAuthLoading(true);

            const response = await fetch(`${API_URL}/api/auth/me`, {
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
        await fetch(`${API_URL}/api/auth/logout`, {
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
    return useContext(AuthContext);
};