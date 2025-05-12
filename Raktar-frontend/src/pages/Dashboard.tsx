import { useContext, useEffect, useState } from "react"; 
import { NavbarMinimal } from "../components/Layout/NavbarMinimal.tsx";
import { Container, Title, Image, Center } from "@mantine/core"; 
import { Outlet, useLocation } from "react-router-dom";
import { IUserRead, UserRole } from "../interfaces/user/IUserRead.ts"; 
import api from "../api/api.ts";
import { AuthContext } from "../context/AuthContext.tsx";


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
        case UserRole.Carrier: return "Fuvarozó";
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
    };
    const { email } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState<IUserRead | null>(null); 
    const location = useLocation(); 


    // Fetch user data based on email
    useEffect(() => {
        const fetchUserData = async () => {
            if (!email) return;
            try {
                const response = await api.User.getAll();
                const users: IUserRead[] = response.data;
                const foundUser = users.find(user => user.email === email);
                if (foundUser) {
                    setCurrentUser(foundUser); 
                    console.log("Talált felhasználó:", {
                        id: foundUser.id,
                        name: foundUser.name,
                        email: foundUser.email,
                        role: foundUser.role,
                    });
                } else {
                    setCurrentUser(null); 
                    console.error("No user found with email:", email);
                }
            } catch (error) {
                setCurrentUser(null);
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [email]);


    //Dashboard component
    return (
        <div style={{ display: "flex", height: '100vh' }}>
            <NavbarMinimal toggle={toggleNavbar} />
            <Container style={{ flex: 1, padding: "1rem" }}>
                {}
                {location.pathname === '/dashboard' && currentUser && (
                    <div style={{alignContent: 'center', textAlign: 'center'}}>
                            <Title order={1} mb="sm">Üdvözöljük {currentUser.name} </Title>
                            <Title order={2} mb="sm">Szerepköre : {getRoleName(currentUser.role)}</Title>
                            <Center>
                                <Image src="/raktar.png" alt="img" w={150} mt={30}/>
                            </Center>
                    </div>
                )}
                {}
                <Outlet />
            </Container>
        </div>
    );
};

export default Dashboard;