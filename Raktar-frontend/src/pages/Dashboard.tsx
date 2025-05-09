import { useContext, useEffect, useState } from "react"; // useState hozzáadása
import { NavbarMinimal } from "../components/Layout/NavbarMinimal.tsx";
import { Container, Title } from "@mantine/core"; // Text és Title importálása
import { Outlet, useLocation } from "react-router-dom"; // useLocation importálása
import { IUserRead, UserRole } from "../interfaces/user/IUserRead.ts"; // UserRole is importálva
import api from "../api/api.ts";
import { AuthContext } from "../context/AuthContext.tsx";

// Segédfüggvény a UserRole enum szöveges megjelenítéséhez (ahogy korábban definiáltuk)
const getRoleName = (roleValue: UserRole | string | undefined): string => {
    if (roleValue === undefined) return "Ismeretlen szerepkör";
    if (typeof roleValue === 'string') {
        const roleKey = Object.keys(UserRole).find(key => String(UserRole[key as keyof typeof UserRole]) === roleValue || key === roleValue);
        if (roleKey && isNaN(Number(roleKey))) {
            return roleKey;
        }
        return roleValue;
    }
    switch (roleValue) {
        case UserRole.Customer: return "Vásárló";
        case UserRole.Supplier: return "Beszállító";
        case UserRole.Carrier: return "Szállító";
        case UserRole.WarehouseStaff: return "Raktáros";
        case UserRole.Admin: return "Adminisztrátor";
        default: {
            const roleName = UserRole[roleValue];
            return roleName || "Ismeretlen szerepkör";
        }
    }
};

const Dashboard = () => {
    const toggleNavbar = () => {
        // Navbar toggle logika
    };
    const { email } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState<IUserRead | null>(null); // State a felhasználói adatoknak
    const location = useLocation(); // Aktuális útvonal lekérdezése

    useEffect(() => {
        const fetchUserData = async () => {
            if (!email) return; // Ha nincs email, ne fusson le a kérés
            try {
                const response = await api.User.getAll();
                // Fontos: Az IUserRead[] típusú tömböt várjuk a response.data-tól
                const users: IUserRead[] = response.data;
                const foundUser = users.find(user => user.email === email);
                if (foundUser) {
                    setCurrentUser(foundUser); // Felhasználói adatok beállítása a state-be
                    console.log("Talált felhasználó:", {
                        id: foundUser.id,
                        name: foundUser.name,
                        email: foundUser.email,
                        role: foundUser.role,
                    });
                } else {
                    setCurrentUser(null); // Ha nem található, ürítsük a state-et
                    console.error("No user found with email:", email);
                }
            } catch (error) {
                setCurrentUser(null);
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [email]);
    return (
        <div style={{ display: "flex", height: '100vh' }}>
            <NavbarMinimal toggle={toggleNavbar} />
            <Container style={{ flex: 1, padding: "1rem" }}>
                {}
                {location.pathname === '/dashboard' && currentUser && (
                    <div style={{alignContent: 'center', textAlign: 'center'}}>
                        <Title order={3} mb="sm">Bejelentkezve: {currentUser.name} </Title>
                            <Title>Szerepkör : {getRoleName(currentUser.role)}</Title>
                    </div>
                )}
                {}
                <Outlet />
            </Container>
        </div>
    );
};

export default Dashboard;