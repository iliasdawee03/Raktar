import { useState } from 'react';
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
import { IOrderCreate } from '../interfaces/order/IOrderCreate';
import api from '../api/api';

const OrderUpdate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const selectedOrder = location.state?.selectedOrder as IOrderRead;
    
    // Állapot a módosított mennyiségek tárolásához
    const [quantities, setQuantities] = useState(
        selectedOrder?.items.reduce((acc, item) => ({
            ...acc,
            [item.ProductId]: item.Quantity
        }), {}) || {}
    );

    const handleQuantityChange = (productId: number, value: number) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            // IOrderCreate objektum létrehozása a frissítéshez
            const updateOrderData: IOrderCreate = {
                CustomerId: selectedOrder.customerId,
                items: selectedOrder.items.map(item => ({
                    ProductId: item.ProductId,
                    Quantity: quantities[item.ProductId]
                }))
            };

            await api.Orders.update(selectedOrder.id, updateOrderData);
            alert('Rendelés sikeresen frissítve!');
            navigate('/dashboard/profile');
        } catch (error) {
            console.error('Hiba történt a rendelés frissítése során:', error);
            alert('Hiba történt a rendelés frissítése során!');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedOrder) {
        return (
            <Container size="sm">
                <Text>Nincs kiválasztott rendelés!</Text>
            </Container>
        );
    }

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
                        {selectedOrder.items.map((item) => (
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