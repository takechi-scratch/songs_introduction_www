"use client";

import { getCurrentUserRole } from "@/lib/auth/firebase";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useUserRole() {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        if (user) {
            getCurrentUserRole().then((result) => {
                setUserRole(result);
            });
        } else {
            setUserRole("guest");
        }
    }, [user]);

    return userRole;
}
