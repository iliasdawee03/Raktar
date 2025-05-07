import { useEffect, useContext, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Container, Title, Text, Card, Group, Button, NumberInput } from "@mantine/core";
import { IProductRead } from "../interfaces/product/IProductRead";
import { IOrderItemCreate } from "../interfaces/order/IOrderItemCreate";
import { AuthContext } from "../context/AuthContext";
import { IOrderCreate } from "../interfaces/order/IOrderCreate";
import api from "../api/api";

interface LocationState {
    selectedProduct: IProductRead | null;
}

const Order = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | null;
    const [quantity, setQuantity] = useState<number>(1);
    const [userId, setUserId] = useState<number | null>(null);
    const {email} = useContext(AuthContext);
    

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await api.User.getAll();
                console.log("All users:", response.data); // Ellenőrizzük a válasz adatait
                console.log("Current email:", email); // Ellenőrizzük a keresett email-t
                
                const user = response.data.find(user => user.email === email);
                console.log("Found user:", user); // Ellenőrizzük a talált felhasználót
                
                if(user) {
                    console.log("Setting userId to:", user.id);
                    setUserId(user.id);
                } else {
                    console.error("No user found with email:", email);
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };
        
        if (email) { // Csak akkor futtatjuk, ha van email
            fetchUserId();
        }
    },[email]);
    
    
    if (!state || !state.selectedProduct) {
        return <Navigate to="/products" />;
    }

    const { selectedProduct } = state;
    const OrderFinalization = async () => {
        try {
            if (!userId) {
                throw new Error("Nincs bejelentkezett felhasználó!");
            }
    
            const OrderItem: IOrderItemCreate = {
                ProductId: selectedProduct.id,
                Quantity: quantity,
            };
    
            const OrderCreate: IOrderCreate = {
                CustomerId: userId,
                items: [OrderItem],
            };
    
            const response = await api.Orders.create(OrderCreate);
            console.log('Rendelés sikeresen létrehozva:', response.data);
            // Sikeres rendelés után navigáció
            navigate('/dashboard/orders');
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response?.status === 403) {
                alert("Nincs megfelelő jogosultsága a rendelés leadásához!");
                navigate('/login');
            } else {
                console.error('Hiba történt a rendelés során:', error);
                alert("Hiba történt a rendelés feldolgozása során!");
            }
        }
    };
    return (
        <Container>
            <Title order={1} mb="md">Rendelés</Title>
            <Card withBorder p="md">
                <Group justify="space-between" align="flex-start">
                    <div>
                        <Text fw={500} size="lg" mb="xs">Kiválasztott termék:</Text>
                        <Text>Név: {selectedProduct.name}</Text>
                        <Text>Ár: {selectedProduct.price} Ft</Text>
                    </div>
                    <div>
                        <NumberInput
                            label="Mennyiség"
                            placeholder="1"
                            min={1}
                            max={10}
                            defaultValue={1}
                            value={quantity}
                            onChange={(value) => setQuantity(typeof value === "number" ? value : 1)}
                            withAsterisk
                            mb="md"
                        />
                    </div>
                    <Button variant="filled" color="blue" onClick={OrderFinalization}>
                        Rendelés leadása
                    </Button>
                </Group>
            </Card>
        </Container>
    );
};

export default Order;