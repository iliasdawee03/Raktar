import { useEffect, useState } from "react";
import { Table, Container, Loader, Title, Checkbox, Button, Group, Select } from "@mantine/core";
import api from "../api/api";
import { IDeliveryFormRead } from "../interfaces/deliveryforms/IDeliveryFormRead";
import { IWarehouseStorageCreate, LocationCode } from "../interfaces/warehouse/IWarehouseStorageCreate";

const locationOptions = Object.keys(LocationCode)
    .filter(key => isNaN(Number(key)))
    .map(key => ({ value: key, label: key }));

const WarehouseStorage = () => {
    const [deliveryForms, setDeliveryForms] = useState<IDeliveryFormRead[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedFormIds, setSelectedFormIds] = useState<Set<number>>(new Set());
    const [locationCodeMap, setLocationCodeMap] = useState<Record<number, keyof typeof LocationCode>>({});

    useEffect(() => {
        const fetchDeliveryForms = async () => {
            setLoading(true);
            const response = await api.DeliveryForm.getAll();
            const filtered = (Array.isArray(response.data) ? response.data : []).filter(
                (form: IDeliveryFormRead) => form.status === "At Warehouse"
            );
            setDeliveryForms(filtered);
            setLoading(false);
        };
        fetchDeliveryForms();
    }, []);

    const handleCheckboxChange = (formId: number, checked: boolean) => {
        setSelectedFormIds(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(formId);
            } else {
                newSet.delete(formId);
            }
            return newSet;
        });
    };

    const handleLocationChange = (productId: number, value: string | null) => {
        if (!value) return;
        setLocationCodeMap(prev => ({
            ...prev,
            [productId]: value as keyof typeof LocationCode,
        }));
    };

    const handleCreateWarehouseStorage = async () => {  
        const selectedForms = deliveryForms.filter(form => selectedFormIds.has(form.id!));
        const warehouseItems: IWarehouseStorageCreate[] = [];
        selectedForms.forEach(form => {
            form.deliveredProducts.forEach(product => {
                const locationCode = locationCodeMap[product.productId];
                if (locationCode) {
                    warehouseItems.push({
                        productId: product.productId,
                        quantity: product.quantity,
                        locationCode: LocationCode[locationCode],
                    });
                }
            });
        });
        if (warehouseItems.length === 0) {
            alert("Nincs minden termékhez kiválasztva hely!");
            return;
        }
        try {
            await Promise.all(
                warehouseItems.map(item =>
                    api.Warehouse.assign(item)
                )
            );
            await Promise.all(
                selectedForms.map(form =>
                    api.DeliveryForm.update(form.id!,"In Storage")
                )
            );
            alert("Sikeres raktározás!");
            setSelectedFormIds(new Set());
            setLocationCodeMap({});
        } catch (err) {
            alert("Hiba történt a raktározás során!");
            console.error(err);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Container>
            <Title order={2} mb="md">Raktárban lévő szállítási űrlapok</Title>
            <Group mb="md">
                <Button
                    onClick={handleCreateWarehouseStorage}
                    disabled={selectedFormIds.size === 0}
                >
                    Kijelöltek raktározása
                </Button>
            </Group>
            {deliveryForms.length === 0 ? (
                <div>Nincs "At Warehouse" státuszú szállítási űrlap.</div>
            ) : (
                deliveryForms.map(form => (
                    <div key={form.id} style={{ marginBottom: 32 }}>
                        <Group align="center" mb="xs">
                            <Checkbox
                                checked={selectedFormIds.has(form.id!)}
                                onChange={e => handleCheckboxChange(form.id!, e.currentTarget.checked)}
                                mr="sm"
                            />
                            <Title order={4} mt="md" mb="xs">
                                Szállítási űrlap #{form.id} (Beszállító: {form.supplierId})
                            </Title>
                        </Group>
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Termék ID</Table.Th>
                                    <Table.Th>Termék név</Table.Th>
                                    <Table.Th>Mennyiség</Table.Th>
                                    <Table.Th>Hely (LocationCode)</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {form.deliveredProducts.map(product => (
                                    <Table.Tr key={product.productId}>
                                        <Table.Td>{product.productId}</Table.Td>
                                        <Table.Td>{product.productName}</Table.Td>
                                        <Table.Td>{product.quantity}</Table.Td>
                                        <Table.Td>
                                            <Select
                                                data={locationOptions}
                                                value={locationCodeMap[product.productId] || null}
                                                onChange={value => handleLocationChange(product.productId, value)}
                                                placeholder="Válassz helyet"
                                                disabled={!selectedFormIds.has(form.id!)}
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </div>
                ))
            )}
        </Container>
    );
};

export default WarehouseStorage;