import { useEffect } from "react";
import { NavbarMinimal } from "../components/Layout/NavbarMinimal.tsx";
import { Container } from "@mantine/core";

const Dashboard = () => {
    const toggleNavbar = () => {
        // Logic for toggling the navbar can be implemented here if needed
    };

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        // Adatok betöltése
    };

    return (
        <div style={{ display: "flex" }}>
            {/* Navbar */}
            <NavbarMinimal toggle={toggleNavbar} />

            {/* Main content */}
            <Container style={{ flex: 1, padding: "1rem" }}>
                <h1>Dashboard Page</h1>
                {/* Ide jöhet a dashboard tartalma */}
            </Container>
        </div>
    );
};

export default Dashboard;