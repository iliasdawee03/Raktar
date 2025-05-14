import { useEffect, useState } from "react";
import api from "../api/api";
import { IOrderRead } from "../interfaces/order/IOrderRead";
import { useNavigate } from "react-router-dom";
import { Container, Loader, Title, Text, Table, Button, Group } from "@mantine/core";
import { IOrderItemRead } from "../interfaces/order/IOrderItemRead";

//interface for summarized order items
export interface ISummarizedOrderItem {
    productId: number;
    productName: string;
    totalQuantity: number;
}

const SupplierOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<IOrderRead[]>([]);
    const [, setAllOrderItems] = useState<IOrderItemRead[]>([]);
    const [summarizedItems, setSummarizedItems] = useState<ISummarizedOrderItem[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const fetchOrdersAndItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.Orders.getAll();
            const fetchedOrders: IOrderRead[] = Array.isArray(response.data) ? response.data : [];
            // Csak a "Pending" státuszú rendelések
            const pendingOrders = fetchedOrders.filter(order => order.status === "Pending");
            setOrders(pendingOrders);

            const itemsFromAllOrders: IOrderItemRead[] = pendingOrders.reduce((acc, currentOrder) => {
                if (currentOrder.items && Array.isArray(currentOrder.items)) {
                    return acc.concat(currentOrder.items);
                }
                return acc;
            }, [] as IOrderItemRead[]);

            setAllOrderItems(itemsFromAllOrders);

            const summarized = itemsFromAllOrders.reduce((acc, item) => {
                if (item.productId === undefined || item.quantity === undefined) {
                    console.warn("Skipping item due to missing productId or quantity:", item);
                    return acc;
                }

                const existingItem = acc.get(item.productId);
                if (existingItem) {
                    existingItem.totalQuantity += item.quantity;
                } else {
                    acc.set(item.productId, {
                        productId: item.productId,
                        productName: item.productName || `Termék ID: ${item.productId}`,
                        totalQuantity: item.quantity,
                    });
                }
                return acc;
            }, new Map<number, ISummarizedOrderItem>());

            setSummarizedItems(Array.from(summarized.values()));

        } catch (err) {
            console.error("Error fetching Orders and Items:", err);
            setError("Failed to fetch Orders. Please try again later.");
            setOrders([]);
            setAllOrderItems([]);
            setSummarizedItems([]);
        } finally {
            setLoading(false);
        }
    };
    fetchOrdersAndItems();
}, []);

    const handleNavigateWithAll = async () => {
    if (summarizedItems.length === 0) {
        alert("Nincs szállítható termék.");
        return;
    }

    try {
        await Promise.all(
            orders.map(order =>
                api.Orders.update(order.id, { ...order, status: "At supplier" })
            )
        );
        navigate("/dashboard/supplierdeliveryform", {
            state: {
                selectedSupplierItems: summarizedItems,
            },
        });
    } catch (err) {
        alert("Nem sikerült minden rendelés státuszát frissíteni!");
        console.error(err);
    }
};

    if (isLoading) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 60px)' }}>
                <Loader />
            </Container>
        );
    }

    if (error) {
        return (
            <Container mt="lg">
                <Text c="red" ta="center">{error}</Text>
            </Container>
        );
    }

    return (
        <Container>
            <Title order={2} mt="xl" mb="md">Szállítandó termékek</Title>
            {summarizedItems.length > 0 ? (
                <>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Termék ID</Table.Th>
                                <Table.Th>Termék Név</Table.Th>
                                <Table.Th>Összes Mennyiség</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {summarizedItems.map((item) => (
                                <Table.Tr key={item.productId}>
                                    <Table.Td>{item.productId}</Table.Td>
                                    <Table.Td>{item.productName}</Table.Td>
                                    <Table.Td>{item.totalQuantity}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <Group justify="flex-end" mt="md">
                        <Button
                            onClick={handleNavigateWithAll}
                            disabled={summarizedItems.length === 0}
                        >
                            Összes szállítása ({summarizedItems.length})
                        </Button>
                    </Group>
                </>
            ) : (
                <Text mt="md">Nincsenek megjeleníthető összegzett rendelési tételek.</Text>
            )}
        </Container>
    );
};

export default SupplierOrders;