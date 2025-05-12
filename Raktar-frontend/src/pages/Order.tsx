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
    
    // Check if the user is logged in
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await api.User.getAll();
                console.log("All users:", response.data); 
                console.log("Current email:", email); 
                
                const user = response.data.find(user => user.email === email);
                console.log("Found user:", user); 
                
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
        
        if (email) {
            fetchUserId();
        }
    },[email]);
    
    // Check if the selected product is available
    // If not, redirect to the products page
    if (!state || !state.selectedProduct) {
        return <Navigate to="/products" />;
    }

    // state for navigating to the order page
    //order finalization
    const { selectedProduct } = state;
    const OrderFinalization = async () => {
        try {
            if (!userId) {
                throw new Error("Nincs bejelentkezett felhasználó!");
            }
    
            const OrderItem: IOrderItemCreate = {
                productId: selectedProduct.id,
                quantity: quantity,
            };
    
            const OrderCreate: IOrderCreate = {
                customerId: userId,
                items: [OrderItem], 
            };
    
            
            const response = await api.Orders.create(OrderCreate);
            console.log('Rendelés sikeresen létrehozva:', response.data);
            alert("Rendelés sikeresen leadva!");    
            navigate('/dashboard/orders');
            
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

    //rendering the order page
    //this page shows the selected product and allows the user to select the quantity
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