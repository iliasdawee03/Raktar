import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Container, 
    Paper, 
    Title, 
    Table,
    NumberInput,
    Button,
    Group,
    Text
} from '@mantine/core';
import { IOrderRead } from '../interfaces/order/IOrderRead';
import api from '../api/api';
import { IOrderUpdate } from '../interfaces/order/IOrderUpdate';

const OrderUpdate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const selectedOrder = location.state?.selectedOrder as IOrderRead;
    const [quantities, setQuantities] = useState<{[key: number]: number}>({}); 

    // Check if the selected order is valid -- DELETE THIS LATER
    useEffect(() => {
        if (selectedOrder?.Items) {
            const initialQuantities = selectedOrder.Items.reduce((acc, item) => {
                acc[item.ProductId] = item.Quantity;
                return acc;
            }, {} as {[key: number]: number});
            setQuantities(initialQuantities);
        } else {
            setQuantities({});
        }
    }, [selectedOrder]);

    // Function to handle quantity change
    // This function updates the quantity of a specific product in the quantities state
    const handleQuantityChange = (productId: number, value: number) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const updateOrderData = {
                CustomerId: selectedOrder.CustomerId,
                Status : selectedOrder.Status,
                Items: selectedOrder.Items.map(item => ({
                    ProductId: item.ProductId,
                    Quantity: quantities[item.ProductId]
                }))
            } as IOrderUpdate;

            await api.Orders.update(selectedOrder.Id, updateOrderData);
            alert('Rendelés sikeresen frissítve!');
            navigate('/dashboard/profile');
        } catch (error: any) { 
        console.error('Hiba történt a rendelés frissítése során:', error);
        let errorMessage = 'Hiba történt a rendelés frissítése során!';
        if (error.response) {

            if (error.response.status === 404) {
                errorMessage = 'A módosítani kívánt rendelés nem található vagy már nem módosítható.';
            } else if (error.response.status === 400) {

                const responseData = error.response.data;
                if (typeof responseData === 'string') {
                    errorMessage = responseData;
                } else if (responseData && typeof responseData.message === 'string') {
                    errorMessage = responseData.message;
                } else if (responseData && responseData.errors) {

                    errorMessage = Object.values(responseData.errors).flat().join('\n');
                } else {
                    errorMessage = 'Érvénytelen adatok vagy ismeretlen hiba a kérés feldolgozása során.';
                }
            } else if (error.response.data && typeof error.response.data.message === 'string') {
                errorMessage = error.response.data.message;
            } else if (error.response.data && typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            }
        } else if (error.request) {
            errorMessage = 'Nem sikerült kapcsolatot létesíteni a szerverrel. Kérjük, ellenőrizze az internetkapcsolatát.';
        }
        alert(errorMessage);
    } finally {
            setLoading(false);
        }
    };
    // Check if the selected order is valid
    if (!selectedOrder) {
        return (
            <Container size="sm">
                <Text>Nincs kiválasztott rendelés!</Text>
            </Container>
        );
    }
    //render the order update form
    // Check if the selected order has items
    return (
        <Container size="sm">
            <Paper shadow="xs" p="md" mt="md">
                <Title order={2} mb="md">Rendelés szerkesztése</Title>
                
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Termék neve</Table.Th>
                            <Table.Th>Mennyiség (db)</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {selectedOrder.Items.map((item) => (
                            <Table.Tr key={item.ProductId}>
                                <Table.Td>{item.ProductName}</Table.Td>
                                <Table.Td>
                                    <NumberInput
                                        value={quantities[item.ProductId]}
                                        onChange={(value) => handleQuantityChange(item.ProductId, Number(value))}
                                        min={1}
                                        max={999}
                                        stepHoldDelay={500}
                                        stepHoldInterval={100}
                                        style={{ width: 100 }}
                                    />
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                <Group justify="flex-end" mt="xl">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/dashboard/profile')}
                    >
                        Mégse
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        Mentés
                    </Button>
                </Group>
            </Paper>
        </Container>
    );
};

export default OrderUpdate;