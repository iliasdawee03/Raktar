import React, { createContext, useState, ReactNode } from "react";
import { emailKeyName, roleKeyName, tokenKeyName } from "../constants/const.ts";

interface AuthContextProps {
    token: string | null;
    setToken: (token: string | null) => void;
    email: string | null;
    setEmail: (email: string | null) => void;
    role: string | null;
    setRole: (role: string | null) => void;
}

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    setToken: () => {},
    email: null,
    setEmail: () => {},
    role: null,
    setRole: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem(tokenKeyName));
    const [email, setEmail] = useState<string | null>(localStorage.getItem(emailKeyName));
    const [role, setRole] = useState<string | null>(localStorage.getItem(roleKeyName));

    const updateToken = (newToken: string | null) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem(tokenKeyName, newToken);
        } else {
            localStorage.removeItem(tokenKeyName);
        }
    };

    const updateEmail = (newEmail: string | null) => {
        setEmail(newEmail);
        if (newEmail) {
            localStorage.setItem(emailKeyName, newEmail);
        } else {
            localStorage.removeItem(emailKeyName);
        }
    };

    const updateRole = (newRole: string | null) => {
        setRole(newRole);
        if (newRole) {
            localStorage.setItem(roleKeyName, newRole);
        } else {
            localStorage.removeItem(roleKeyName);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken: updateToken,
                email,
                setEmail: updateEmail,
                role,
                setRole: updateRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};