import { Container, Loader, Table, Text, Title, Alert, Checkbox, NumberInput, Button, Group, TextInput } from "@mantine/core"; // Szükséges Mantine komponensek importálása
import { useEffect, useState } from "react";
import { IDeliveryFormRead } from "../interfaces/deliveryforms/IDeliveryFormRead";
import api from "../api/api";
import { IDeliveredProductRead } from "../interfaces/deliveredproducts/IDeliveredProductRead";

interface ISummarizedWarehouseProduct {
    productId: number;
    productName?: string;
    totalQuantity: number;
}


export interface ITransferItem {
    productId: number;
    productName?: string;
    quantityToTransfer: number;
    currentStock: number;
}


const WarehouseStorage = () => {
    const [, setDeliveryForms] = useState<IDeliveryFormRead[]>([]);
    const [, setDeliveryFormProducts] = useState<IDeliveredProductRead[]>([]);
    const [summarizedProducts, setSummarizedProducts] = useState<ISummarizedWarehouseProduct[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItemsToTransfer, setSelectedItemsToTransfer] = useState<Map<number, { quantity: number; productName?: string; currentStock: number }>>(new Map());
    
    const [locationId, setLocationId] = useState<string>(''); 

    useEffect(() => {
        const fetchDeliveryForms = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.DeliveryForm.getAll();
                const fetchedDeliveryForms: IDeliveryFormRead[] = Array.isArray(response.data) ? response.data : [];
                setDeliveryForms(fetchedDeliveryForms);

                const itemsFromAllDeliveryForms: IDeliveredProductRead[] = fetchedDeliveryForms.reduce((acc, currentDeliveryForm) => {
                    if (currentDeliveryForm.deliveredProducts && Array.isArray(currentDeliveryForm.deliveredProducts)) {
                        return acc.concat(currentDeliveryForm.deliveredProducts);
                    }
                    return acc;
                }, [] as IDeliveredProductRead[]);
                setDeliveryFormProducts(itemsFromAllDeliveryForms);

                const summarized = itemsFromAllDeliveryForms.reduce((acc, item) => {
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
                }, new Map<number, ISummarizedWarehouseProduct>());

                setSummarizedProducts(Array.from(summarized.values()));

            } catch (err) {
                console.error("Error fetching delivery forms:", err);
                setError("Hiba történt a szállítólevelek vagy termékek betöltésekor.");
                setSummarizedProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveryForms();
    }, []);

    const handleCheckboxChange = (productId: number, productName: string | undefined, currentStock: number, checked: boolean) => {
        setSelectedItemsToTransfer(prevMap => {
            const newMap = new Map(prevMap);
            if (checked) {
                if (!newMap.has(productId)) {
                    newMap.set(productId, { quantity: 0, productName, currentStock });
                }
            } else {
                newMap.delete(productId);
            }
            return newMap;
        });
    };

    const handleQuantityChange = (productId: number, quantity: number | string) => {
        const numQuantity = Number(quantity);
        setSelectedItemsToTransfer(prevMap => {
            const newMap = new Map(prevMap);
            const item = newMap.get(productId);
            if (item) {
                newMap.set(productId, { ...item, quantity: numQuantity });
            }
            return newMap;
        });
    };


    const handleCreateWarehouseEntries = async () => {
        if (locationId.trim() === '') {
            alert("Kérjük, adjon meg egy érvényes Raktárhely ID-t!");
            return;
        }

        const itemsToAssign: Array<{ productId: number; quantity: number; locationId: string }> = [];
        selectedItemsToTransfer.forEach((value, productId) => {
            if (value.quantity > 0) {
                itemsToAssign.push({
                    productId,
                    quantity: value.quantity,
                    locationId: locationId.trim()
                });
            }
        });

        if (itemsToAssign.length > 0) {
            setLoading(true); 
            setError(null);
            let successCount = 0;
            let errorCount = 0;

            try {
                for (const item of itemsToAssign) {
                    try {
                        await api.Warehouse.assign(item.productId, item.locationId);
                        successCount++;
                    } catch (assignError) {
                        console.error(`Hiba a(z) ${item.productId} termék hozzárendelésekor a(z) ${item.locationId} helyhez:`, assignError);
                        errorCount++;
                    }
                }

                if (errorCount > 0) {
                    alert(`${successCount} termék sikeresen hozzárendelve. ${errorCount} termék hozzárendelése sikertelen volt. Részletek a konzolon.`);
                } else {
                    alert(`${successCount} termék sikeresen hozzárendelve a(z) "${locationId.trim()}" raktárhelyhez.`);
                }
                

                setSelectedItemsToTransfer(new Map());
                setLocationId('');

            } catch (generalError) {
                console.error("Általános hiba a hozzárendelések során:", generalError);
                setError("Hiba történt a termékek raktárhelyhez rendelése közben.");
            } finally {
                setLoading(false);
            }

        } else {
            alert("Nincsenek hozzárendelésre kiválasztott termékek (mennyiség > 0).");
        }
    };
    if (isLoading) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)' }}>
                <Loader />
            </Container>
        );
    }

    if (error) {
        return (
            <Container mt="lg">
                <Alert title="Hiba" color="red" >
                    {error}
                </Alert>
            </Container>
        );
    }

    const isItemSelected = (productId: number) => selectedItemsToTransfer.has(productId);
    const getQuantityForSelected = (productId: number) => selectedItemsToTransfer.get(productId)?.quantity ?? 0;


    return (
        <Container>
            <Title order={2} mt="xl" mb="md">Raktárkészlet Összesítő</Title>
            {summarizedProducts.length > 0 ? (
                <>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ width: '50px' }}>Kiv.</Table.Th>
                                <Table.Th>Termék ID</Table.Th>
                                <Table.Th>Termék Név</Table.Th>
                                <Table.Th>Raktáron (db)</Table.Th>
                                <Table.Th style={{ width: '150px' }}>Raktárra vett menny. (db)</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {summarizedProducts.map((item) => {
                                const quantityToTransferThisItem = getQuantityForSelected(item.productId);
                                const displayStock = item.totalQuantity - quantityToTransferThisItem;

                                return (
                                    <Table.Tr key={item.productId}>
                                        <Table.Td>
                                            <Checkbox
                                                checked={isItemSelected(item.productId)}
                                                onChange={(event) => handleCheckboxChange(item.productId, item.productName, item.totalQuantity, event.currentTarget.checked)}
                                            />
                                        </Table.Td>
                                        <Table.Td>{item.productId}</Table.Td>
                                        <Table.Td>{item.productName}</Table.Td>
                                        <Table.Td>{displayStock}</Table.Td>
                                        <Table.Td>
                                            <NumberInput
                                                value={quantityToTransferThisItem}
                                                onChange={(value) => handleQuantityChange(item.productId, value)}
                                                min={0}
                                                max={item.totalQuantity}
                                                disabled={!isItemSelected(item.productId)}
                                                placeholder="Mennyiség"
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>
                    <Group mt="md" style={{ alignItems: 'flex-end' }}>
                        <TextInput // NumberInput helyett TextInput
                            label="Raktárhely ID"
                            placeholder="Adja meg a raktárhely ID-t"
                            value={locationId}
                            onChange={(event) => setLocationId(event.currentTarget.value)} // onChange eseménykezelő
                            style={{ flexGrow: 1 }}
                        />
                        <Button
                            onClick={handleCreateWarehouseEntries}
                            disabled={
                                (Array.from(selectedItemsToTransfer.values()).every(item => item.quantity === 0) && selectedItemsToTransfer.size > 0) ||
                                selectedItemsToTransfer.size === 0 ||
                                locationId.trim() === '' // Ellenőrizzük, hogy a locationId nem üres-e
                            }
                            style={{ alignSelf: 'flex-end' }}
                        >
                            Raktárra Vétel ({Array.from(selectedItemsToTransfer.values()).filter(item => item.quantity > 0).length})
                        </Button>
                    </Group>
                </>
            ) : (
                <Text mt="md">Nincsenek megjeleníthető raktárkészlet adatok.</Text>
            )}
        </Container>
    );
};

export default WarehouseStorage;