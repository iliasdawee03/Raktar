import { useEffect, useState } from "react";
import { Table, Container, Loader, Title, Checkbox, Button, Group } from "@mantine/core";
import api from "../api/api";
import { IDeliveryFormRead } from "../interfaces/deliveryforms/IDeliveryFormRead";


const WarehouseStorage = () => {
    const [deliveryForms, setDeliveryForms] = useState<IDeliveryFormRead[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedFormIds, setSelectedFormIds] = useState<Set<number>>(new Set());
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchDeliveryForms = async () => {
            setLoading(true);
            const response = await api.DeliveryForm.getAll();
            const filtered = (Array.isArray(response.data) ? response.data : []).filter(
                (form: IDeliveryFormRead) => form.status === "Filled"
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

    const handleUpdateStatus = async () => {
        setUpdating(true);
        try {
            await Promise.all(
                Array.from(selectedFormIds).map(id =>
                    api.DeliveryForm.update(id, { status: "At Warehouse" })
                )
            );
            const response = await api.DeliveryForm.getAll();
            const filtered = (Array.isArray(response.data) ? response.data : []).filter(
                (form: IDeliveryFormRead) => form.status === "Filled"
            );
            setDeliveryForms(filtered);
            setSelectedFormIds(new Set());
            alert("Sikeresen frissítetted a státuszokat!");
        } catch (err) {
            alert("Nem sikerült frissíteni a státuszokat!");
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Container>
            <Title order={2} mb="md">Szállítási űrlapok (Filled státusz)</Title>
            <Group mb="md">
                <Button
                    onClick={handleUpdateStatus}
                    disabled={selectedFormIds.size === 0 || updating}
                    loading={updating}
                >
                    Kijelöltek státuszának átállítása "At Warehouse"-ra
                </Button>
            </Group>
            {deliveryForms.length === 0 && <div>Nincs "Filled" státuszú szállítási űrlap.</div>}
            {deliveryForms.map(form => (
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
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {form.deliveredProducts.map(product => (
                                <Table.Tr key={product.productId}>
                                    <Table.Td>{product.productId}</Table.Td>
                                    <Table.Td>{product.productName}</Table.Td>
                                    <Table.Td>{product.quantity}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>
            ))}
        </Container>
    );
};

export default WarehouseStorage;