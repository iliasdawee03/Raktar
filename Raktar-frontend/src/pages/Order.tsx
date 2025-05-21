import { useEffect, useContext, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Container, Title, Card, Group, Button, Table, Alert } from "@mantine/core";
import { IOrderItemCreate } from "../interfaces/order/IOrderItemCreate"; // Ez az interfész csak productId-t és quantity-t tartalmaz
import { AuthContext } from "../context/AuthContext";
import { IOrderCreate } from "../interfaces/order/IOrderCreate";
import api from "../api/api";

interface LocationState {
    orderItems: IOrderItemCreate[]; 
}

const Order = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | null;
    const [userId, setUserId] = useState<number | null>(null);
    const { email } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await api.User.getAll();
                const user = response.data.find(u => u.email === email);
                if (user) {
                    setUserId(user.id);
                } else {
                    console.error("Bejelentkezett felhasználó nem található az email alapján:", email);
                    alert("Hiba: A felhasználói adatok nem töltődtek be megfelelően. Kérjük, jelentkezzen be újra.");
                    navigate('/login');
                }
            } catch (error) {
                console.error("Hiba a felhasználói ID lekérése közben:", error);
                alert("Hiba történt a felhasználói adatok lekérése során.");
            }
        };

        if (email) {
            fetchUserId();
        } else {
            alert("Kérjük, jelentkezzen be a rendelés folytatásához.");
            navigate('/login');
        }
    }, [email, navigate]);

    if (!state || !state.orderItems || !Array.isArray(state.orderItems) ){
        console.warn("A rendelési oldal rendelési tételek nélkül lett megnyitva (vagy hiba történt), átirányítás a termékekhez...");
        if (!state?.orderItems || state.orderItems.length === 0) {
             return <Navigate to="/dashboard/products" />;
        }
    }

    const { orderItems } = state || { orderItems: [] }; 

    const OrderFinalization = async () => {

        if (!userId) {
            alert("A felhasználói adatok nem érhetők el. Kérjük, próbálja meg később, vagy jelentkezzen be újra.");
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const orderCreatePayload: IOrderCreate = {
                CustomerId: userId,
                Items: orderItems, 
            };

            const response = await api.Orders.create(orderCreatePayload);
            console.log('Rendelés sikeresen létrehozva:', response.data);
            alert("Rendelés sikeresen leadva!");
            navigate('/dashboard'); 

        } catch (error: any) {
            if (error.response?.status === 403) {
                alert("Nincs megfelelő jogosultsága a rendelés leadásához!");
                navigate('/login');
            } else {
                console.error('Hiba történt a rendelés során:', error);
                alert(`Hiba történt a rendelés feldolgozása során: ${error.message || 'Ismeretlen hiba'}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToProducts = () => {
        navigate('/dashboard/product', { 
            state: { currentOrderState: orderItems } 
        });
    };

    return (
        <Container>
            <Title order={1} mb="xl">Rendelés Véglegesítése</Title>

            <Card withBorder p="lg" radius="md" shadow="sm" mb="xl">
                <Title order={3} mb="md">Rendelési Tételek</Title>
                {orderItems.length > 0 ? (
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Termék ID</Table.Th>
                                <Table.Th>Mennyiség</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {orderItems.map((item, index) => (
                                <Table.Tr key={`${item.ProductId}-${index}`}> 
                                    <Table.Td>{item.ProductId}</Table.Td>
                                    <Table.Td>{item.Quantity} db</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Alert color="orange" title="Nincsenek tételek">
                        Nincsenek termékek a rendelésben. Kérjük, válasszon termékeket.
                    </Alert>
                )}
            </Card>

            <Group justify="space-between" mt="xl">
                <Button
                    variant="outline"
                    onClick={handleBackToProducts}
                    disabled={isSubmitting} 
                >
                    További termékek hozzáadása
                </Button>
                <Button
                    variant="filled"
                    color="blue"
                    onClick={OrderFinalization}
                    disabled={isSubmitting || orderItems.length === 0 || !userId}
                    loading={isSubmitting}
                >
                    Rendelés Leadása
                </Button>
            </Group>
        </Container>
    );
};

export default Order;