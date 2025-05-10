// Feltételezett fogadó komponens (pl. SupplierDeliveryForm.tsx)

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form'; // Mantine form hook importálása
import { Container, TextInput, Button, Paper, Title, Text, Alert, LoadingOverlay, Group } from '@mantine/core'; // Mantine komponensek
import { DatePickerInput } from '@mantine/dates'; // Mantine DatePickerInput
import 'dayjs/locale/hu'; // Magyar lokalizáció a dátumválasztóhoz
import { IDeliveredProductCreate } from '../interfaces/deliveredproducts/IDeliveryProductCreate';
import { IDeliveryFormCreate } from '../interfaces/deliveryforms/IDeliveryFormCreate'; // Importáld az interfészt
import { ISummarizedOrderItem } from '../pages/SupplierOrders'; // Vagy ahonnan importálod
import api from '../api/api'; 

interface DeliveryFormValues {
    supplierId: number | undefined; // Lehet undefined kezdetben
    expectedDeliveryDate: Date | null;
}

const SupplierDeliveryForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [deliveredProducts, setDeliveredProducts] = useState<IDeliveredProductCreate[]>([]);
    const [originalSummarizedItems, setOriginalSummarizedItems] = useState<ISummarizedOrderItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<DeliveryFormValues>({
        initialValues: {
            supplierId: undefined,
            expectedDeliveryDate: null,
        },
        validate: {
            supplierId: (value) => (value === undefined || value === null || value <= 0 ? 'A beszállító ID megadása kötelező és pozitív számnak kell lennie.' : null),
            expectedDeliveryDate: (value) => (value ? null : 'A várható szállítási dátum megadása kötelező.'),
        },
    });

    useEffect(() => {
        if (location.state && location.state.selectedSupplierItems) {
            const summarizedItemsFromState = location.state.selectedSupplierItems as ISummarizedOrderItem[];
            setOriginalSummarizedItems(summarizedItemsFromState);

            if (!Array.isArray(summarizedItemsFromState)) {
                console.error("selectedSupplierItems is not an array:", summarizedItemsFromState);
                setError("Hiba: A kapott termékadatok formátuma nem megfelelő.");
                setDeliveredProducts([]);
                return;
            }

            const transformedProducts: IDeliveredProductCreate[] = summarizedItemsFromState.map(item => {
                if (typeof item.productId !== 'number' || typeof item.totalQuantity !== 'number') {
                    console.warn("Skipping item due to missing or invalid productId/totalQuantity:", item);
                    return null;
                }
                return {
                    productId: item.productId,
                    quantity: item.totalQuantity,
                };
            }).filter(item => item !== null) as IDeliveredProductCreate[];

            setDeliveredProducts(transformedProducts);

            if (transformedProducts.length === 0 && summarizedItemsFromState.length > 0) {
                setError("Hiba: Nem sikerült feldolgozni a kiválasztott termékeket. Ellenőrizze az adatokat.");
            } else if (transformedProducts.length === 0 && summarizedItemsFromState.length === 0) {
                 setError("Nincsenek kiválasztott termékek a szállításhoz. Kérjük, válasszon ki termékeket az előző oldalon.");
            }

        } else {
            setError("Nincsenek kiválasztott termékek a szállításhoz. Kérjük, válasszon ki termékeket az előző oldalon.");
        }
    }, [location.state, navigate]);

    const handleFormSubmit = async (values: DeliveryFormValues) => {
        setError(null);
        setSuccess(null);

        if (deliveredProducts.length === 0) {
            setError("Nincsenek termékek hozzáadva a szállítmányhoz.");
            return;
        }
        if (values.supplierId === undefined || values.expectedDeliveryDate === null) {
            setError("Kérjük, töltse ki a beszállító ID-t és a várható szállítási dátumot.");
            return;
        }

        setLoading(true);

        const deliveryFormData: IDeliveryFormCreate = {
            supplierId: values.supplierId,
            expectedDeliveryDate: values.expectedDeliveryDate,
            deliveredProducts: deliveredProducts,
        };

        try {
            await api.DeliveryForm.create(deliveryFormData);
            setSuccess("Szállítási űrlap sikeresen létrehozva!");
            console.log("Beküldött szállítási űrlap:", deliveryFormData);
            form.reset();
            setDeliveredProducts([]);
            setOriginalSummarizedItems([]);

            setTimeout(() => {
                navigate('/dashboard/deliveryforms'); // Vagy ahova szeretnéd
            }, 2000);
        } catch (err: any) {
            console.error("Hiba a szállítási űrlap létrehozásakor:", err);
            setError(err.response?.data?.message || err.message || "Hiba történt a szállítási űrlap létrehozása során.");
        } finally {
            setLoading(false);
        }
    };

    if (!location.state || !location.state.selectedSupplierItems && !success) {
        return (
            <Container>
                <Paper p="md" shadow="xs" mt="xl">
                    <Title order={3} ta="center" mb="lg">Szállítási Adatok Megadása</Title>
                    <Text c="red" ta="center">
                        Nincsenek kiválasztott termékek a szállításhoz. Kérjük, <Button variant="subtle" onClick={() => navigate(-1)}>menjen vissza</Button> és válasszon ki termékeket.
                    </Text>
                </Paper>
            </Container>
        );
    }


    return (
        <Container>
            <Paper p="md" shadow="xs" mt="xl">
                <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
                <Title order={3} ta="center" mb="lg">Szállítási Adatok Megadása</Title>

                {error && <Alert title="Hiba" color="red" withCloseButton onClose={() => setError(null)} mb="md">{error}</Alert>}
                {success && <Alert title="Siker" color="green" withCloseButton onClose={() => setSuccess(null)} mb="md">{success}</Alert>}

                {originalSummarizedItems.length > 0 && !success && (
                    <Paper withBorder p="sm" mb="md">
                        <Text fw={500} mb="xs">Kiválasztott termékek:</Text>
                        <ul>
                            {originalSummarizedItems.map(item => (
                                <li key={item.productId}>
                                    {item.productName} (ID: {item.productId}) - Mennyiség: {item.totalQuantity}
                                </li>
                            ))}
                        </ul>
                    </Paper>
                )}

                {!success && deliveredProducts.length > 0 && ( 
                    <form onSubmit={form.onSubmit(handleFormSubmit)}>
                        <TextInput
                            label="Beszállító ID"
                            placeholder="Adja meg a beszállító ID-jét"
                            type="number"
                            required
                            {...form.getInputProps('supplierId')}
                            mb="md"
                        />
                        <DatePickerInput
                            locale="hu"
                            label="Várható szállítási dátum"
                            placeholder="Válasszon dátumot"
                            required
                            {...form.getInputProps('expectedDeliveryDate')}
                            mb="md"
                            minDate={new Date()}
                        />
                        <Group justify="flex-end" mt="lg">
                            <Button type="submit" loading={loading}>
                                Szállítási Űrlap Létrehozása
                            </Button>
                        </Group>
                    </form>
                )}
                 {!success && deliveredProducts.length === 0 && originalSummarizedItems.length > 0 && !error && (
                    <Text c="orange" ta="center" mt="md">
                        A kiválasztott termékek feldolgozása nem sikerült, vagy nem maradt érvényes termék.
                    </Text>
                )}
            </Paper>
        </Container>
    );
};

export default SupplierDeliveryForm;