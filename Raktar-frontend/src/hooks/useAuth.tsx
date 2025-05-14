import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import { emailKeyName, roleKeyName, tokenKeyName } from "../constants/const.ts";
import api from "../api/api.ts";
import { jwtDecode }from "jwt-decode";

    const useAuth = () => {
        const { token, setToken, email, setEmail, role, setRole } = useContext(AuthContext);
        const [isLoading, setIsLoading] = useState(true); 
    
        const isLoggedIn = !!token;
    
        const login = async (email: string, password: string) => {
            try {
                const res = await api.Auth.login(email, password);
                setToken(res.data.token);
                localStorage.setItem(tokenKeyName, res.data.token);
    
                interface DecodedToken {
                    [key: string]: string;
                }
                const decodedToken: DecodedToken = jwtDecode<DecodedToken>(res.data.token);
                const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                setRole(role);
                localStorage.setItem(roleKeyName, role);
    
                setEmail(email);
                localStorage.setItem(emailKeyName, email);
    
                console.log("Bejelentkezés sikeres:", res.data);
            } catch (error) {
                console.error("Bejelentkezési hiba:", error);
                throw error;
            }
        };

        const logout = () => {
            localStorage.removeItem(tokenKeyName);
            localStorage.removeItem(emailKeyName);
            localStorage.removeItem(roleKeyName);
            setToken(null);
            setEmail(null);
            setRole(null);
        };

        useEffect(() => {
            const storedToken = localStorage.getItem(tokenKeyName);
            const storedEmail = localStorage.getItem(emailKeyName);
            const storedRole = localStorage.getItem(roleKeyName);
    
            if (storedToken) setToken(storedToken);
            if (storedEmail) setEmail(storedEmail);
            if (storedRole) setRole(storedRole);
    
            setIsLoading(false); 
        }, [setToken, setEmail, setRole]);
    return { login, logout, token, email, isLoggedIn, isLoading, role };
};

export default useAuth;