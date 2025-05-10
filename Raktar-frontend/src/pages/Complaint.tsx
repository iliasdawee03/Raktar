import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Title,
    Textarea,
    Button,
    Group,
    Text,
    Alert,
    LoadingOverlay,
    Stack
} from '@mantine/core';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { IOrderRead } from '../interfaces/order/IOrderRead';
import { IComplaintCreate } from '../interfaces/complaint/IComplaintCreate';
import api from '../api/api'; 

const ComplaintPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedOrder, setSelectedOrder] = useState<IOrderRead | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [userIdFromState, setUserIdFromState] = useState<number | null>(null); // Új state a userId-nak

    useEffect(() => {
        let orderFromState: IOrderRead | null = null;
        let idFromState: number | null = null;

        if (location.state) {
            if (location.state.selectedOrder) {
                orderFromState = location.state.selectedOrder as IOrderRead;
                setSelectedOrder(orderFromState);
            }
            if (location.state.userId) { // Ellenőrizzük, hogy a userId is át lett-e adva
                idFromState = location.state.userId as number;
                setUserIdFromState(idFromState);
            }
        }

        if (!orderFromState) {
            setError("Nincs kiválasztott rendelés a panaszhoz. Kérjük, próbálja újra a rendelések oldalról.");
        }
        if (!idFromState && orderFromState) { // Csak akkor jelezzük hibaként, ha az order megvan, de a userId hiányzik a state-ből
            setError(prevError => prevError ? `${prevError}\nFelhasználói azonosító hiányzik a navigációs állapotból.` : "Felhasználói azonosító hiányzik a navigációs állapotból.");
            console.warn("Felhasználói azonosító (userId) nem található a location.state-ben.");
        }

    }, [location.state]);

    const handleSubmit = async () => {
        if (!selectedOrder) {
            setError("Hiba: A rendelés részletei hiányoznak.");
            return;
        }
        if (!userIdFromState) {
            setError("Hiba: Felhasználói azonosító hiányzik. Kérjük, próbálja újra, vagy jelentkezzen be ismét.");
            return;
        }
        if (!description.trim()) {
            setError("A panasz leírása nem lehet üres.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        const complaintData: IComplaintCreate = {
            OrderId: selectedOrder.id,
            UserId: userIdFromState, 
            Description: description,
        };

        try {
            await api.Complaint.create(complaintData);
            setSuccess('Panasz sikeresen rögzítve!');
            setDescription('');
            setTimeout(() => {
                navigate('/dashboard/profile');
            }, 2000);
        } catch (err: any) {
            console.error("Hiba a panasz beküldésekor:", err);
            setError(err.response?.data?.message || err.message || 'Hiba történt a panasz rögzítése során.');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedOrder && !error && !userIdFromState) {
        return <LoadingOverlay visible={true} />;
    }

    return (
        <Container size="sm" mt="lg">
            <Paper shadow="md" p="lg" radius="md" withBorder>
                <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
                <Title order={2} ta="center" mb="xl">
                    Panasz Bejelentése
                </Title>

                {selectedOrder && (
                    <Text mb="md" ta="center" c="dimmed">
                        Rendelés azonosító: {selectedOrder.id}
                    </Text>
                )}

                {error && (
                    <Alert icon={<IconAlertCircle size="1rem" />} title="Hiba!" color="red" withCloseButton onClose={() => setError(null)} mb="md">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert icon={<IconCircleCheck size="1rem" />} title="Siker!" color="green" withCloseButton onClose={() => setSuccess(null)} mb="md">
                        {success}
                    </Alert>
                )}

                {selectedOrder && userIdFromState && (
                    <Stack>
                        <Textarea
                            label="Panasz leírása"
                            placeholder="Kérjük, részletezze a problémát..."
                            value={description}
                            onChange={(event) => setDescription(event.currentTarget.value)}
                            minRows={4}
                            autosize
                            required
                            disabled={loading || !!success}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button
                                onClick={handleSubmit}
                                loading={loading}
                                disabled={!!success}
                            >
                                Panasz Beküldése
                            </Button>
                        </Group>
                    </Stack>
                )}
                 {!selectedOrder && error && (
                    <Text c="red" ta="center">A panaszbejelentéshez szükséges rendelési adatok nem érhetőek el.</Text>
                )}
                 {selectedOrder && !userIdFromState && !error && (
                    <Alert icon={<IconAlertCircle size="1rem" />} title="Azonosítási Hiba" color="orange" mb="md">
                        A felhasználói azonosító nem érhető el a navigációs adatokból. A panasz beküldéséhez ez szükséges.
                    </Alert>
                )}
            </Paper>
        </Container>
    );
};

export default ComplaintPage;