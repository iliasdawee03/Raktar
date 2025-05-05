import { useEffect } from "react";
import { NavbarMinimal } from "../components/Layout/NavbarMinimal.tsx";
import { Container } from "@mantine/core";

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
            <Container style={{ flex: 1, padding: "1rem" }}>
            </Container>
        </div>
    );
};

export default Dashboard;