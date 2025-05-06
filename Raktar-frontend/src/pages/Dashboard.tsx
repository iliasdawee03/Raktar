import { useEffect } from "react";
import { NavbarMinimal } from "../components/Layout/NavbarMinimal.tsx";
import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
    const toggleNavbar = () => {
        // Navbar minimalizálása vagy megjelenítése
    };

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
    };

    return (
        <div style={{ display: "flex" }}>
            <NavbarMinimal toggle={toggleNavbar} />
            {/* A NavbarMinimal komponens itt van elhelyezve */}
            <Container style={{ flex: 1, padding: "1rem" }}>
                <Outlet/>{/* nested Route components*/}
            </Container>
        </div>
    );
};

export default Dashboard;