import { useEffect, useState } from "react";
import api from "../api/api";
import { IOrderRead } from "../interfaces/order/IOrderRead";
import { useNavigate } from "react-router-dom";
import { Container, Loader, Title, Text, Table, Button, Checkbox, Group } from "@mantine/core"; // Checkbox és Group importálva
import { IOrderItemRead } from "../interfaces/order/IOrderItemRead";

export interface ISummarizedOrderItem {
    productId: number;
    productName: string;
    totalQuantity: number;
}

const SupplierOrders = () => {
    const navigate = useNavigate();
    const [, setOrders] = useState<IOrderRead[]>([]);
    const [, setAllOrderItems] = useState<IOrderItemRead[]>([]);
    const [summarizedItems, setSummarizedItems] = useState<ISummarizedOrderItem[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchOrdersAndItems = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.Orders.getAll();
                const fetchedOrders: IOrderRead[] = Array.isArray(response.data) ? response.data : [];
                setOrders(fetchedOrders);

                const itemsFromAllOrders: IOrderItemRead[] = fetchedOrders.reduce((acc, currentOrder) => {
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

    // Kezelő a checkbox állapotának változásához
    const handleCheckboxChange = (productId: number) => {
        setSelectedProductIds(prevSelectedIds => {
            const newSelectedIds = new Set(prevSelectedIds);
            if (newSelectedIds.has(productId)) {
                newSelectedIds.delete(productId);
            } else {
                newSelectedIds.add(productId);
            }
            return newSelectedIds;
        });
    };

    // Kezelő a kiválasztott termékekkel való navigációhoz
    const handleNavigateWithSelected = () => {
        const selectedItemsToNavigate = summarizedItems.filter(item => selectedProductIds.has(item.productId));
        if (selectedItemsToNavigate.length > 0) {
            navigate("/dashboard/supplierdeliveryform", {
                state: {
                    // Fontos: A fogadó oldalnak ezt a kulcsot kell várnia
                    // és tudnia kell, hogy ez egy ISummarizedOrderItem tömb.
                    selectedSupplierItems: selectedItemsToNavigate,
                },
            });
        } else {
            alert("Nincs kiválasztott termék a szállításhoz.");
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
                                <Table.Th style={{ width: '50px' }}>Kiv.</Table.Th> {/* Checkbox oszlop */}
                                <Table.Th>Termék ID</Table.Th>
                                <Table.Th>Termék Név</Table.Th>
                                <Table.Th>Összes Mennyiség</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {summarizedItems.map((item) => (
                                <Table.Tr key={item.productId}>
                                    <Table.Td>
                                        <Checkbox
                                            checked={selectedProductIds.has(item.productId)}
                                            onChange={() => handleCheckboxChange(item.productId)}
                                            aria-label={`Select product ${item.productName}`}
                                        />
                                    </Table.Td>
                                    <Table.Td>{item.productId}</Table.Td>
                                    <Table.Td>{item.productName}</Table.Td>
                                    <Table.Td>{item.totalQuantity}</Table.Td>
                                    {/* Az egyedi "Áruszállítás" gomb eltávolítva innen */}
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <Group justify="flex-end" mt="md">
                        <Button
                            onClick={handleNavigateWithSelected}
                            disabled={selectedProductIds.size === 0} 
                        >
                            Kiválasztottak szállítása ({selectedProductIds.size})
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