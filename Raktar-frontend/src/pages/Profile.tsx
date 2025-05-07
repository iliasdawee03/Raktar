import { useState, useContext, useEffect } from 'react';
import { 
    Container, 
    Title, 
    TextInput, 
    Button, 
    Paper, 
    Stack,
    PasswordInput,
    Group,
    Table,
} from "@mantine/core";
import { AuthContext } from '../context/AuthContext';
import { useForm } from '@mantine/form';
import api from '../api/api';
import { IOrderRead } from '../interfaces/order/IOrderRead';

interface ProfileFormValues {
    name: string;
    email: string;
    phone: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const Profile = () => {
    const { email } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [userData, setUserData] = useState<ProfileFormValues | null>(null);
    const [orders, setOrders] = useState<IOrderRead[]>([]); 
    
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '-';
    
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
    
            return `${year}. ${month}. ${day}. ${hour}:${minute}`;
        } catch {
            return '-';
        }
    };

    const form = useForm<ProfileFormValues>({
        initialValues: {
            email: '',
            name: '',
            phone: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Érvénytelen email cím'),
            newPassword: (value, values) =>
                values.newPassword && values.newPassword.length < 6
                    ? 'A jelszó minimum 6 karakter hosszú legyen'
                    : null,
            confirmPassword: (value, values) =>
                values.newPassword && value !== values.newPassword
                    ? 'A jelszavak nem egyeznek'
                    : null,
        }
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.User.getAll();
                const user = response.data.find(user => user.email === email);
                
                console.log("User ID:", user?.id);
                if (user) {
                    //DEBUG
                    console.log("Talált felhasználó:", {
                        id: user.id,
                        email: user.email,
                        typeof_id: typeof user.id
                    });

                    setUserId(user.id);
                    const profileValues: ProfileFormValues = {
                        email: user.email,
                        name: user.name,
                        phone: String(user.phone),
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    };

                    setUserData(profileValues);
                    form.setValues(profileValues);
                    const ordersResponse = await api.Orders.getAll();

 
                    //DEBUG
                    console.log("Orders response:", ordersResponse.data);
                    
                    const userOrders = ordersResponse.data.filter(order => {
                        const isMatch = order.customerId === user.id;
                        console.log(`Comparing order ${order.id}:`, {
                            order_customerId: order.customerId,
                            user_id: user.id,
                            isMatch: isMatch
                        });
                        return isMatch;
                    });

                    console.log("Szűrt rendelések:", userOrders);
                    setOrders(userOrders); 
                } else {
                    console.error("No user found with email:", email);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (email) {
            fetchUserData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    const handleSubmit = async (values: ProfileFormValues) => {
        try {
            setLoading(true);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateData: any = {
                name: values.name,
                email: values.email,
                phone: values.phone
            };

            if (values.newPassword) {
                updateData.password = values.newPassword;
            }

            if (userId !== null) {
                await api.User.update(userId, updateData);
            } else {
                throw new Error('User ID is null. Cannot update profile.');
            }

            setIsEditing(false);
            alert('Profil sikeresen frissítve!');
        } catch (error) {
            console.error('Hiba történt a profil frissítésekor:', error);
            alert('Hiba történt a profil frissítésekor!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="sm">
            <Paper shadow="xs" p="md" mt="md">
                <Title order={2} mb="md">Profil Beállítások</Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Email cím"
                            {...form.getInputProps('email')}
                            disabled={!isEditing}
                        />

                        <TextInput
                            label="Név"
                            {...form.getInputProps('name')}
                            disabled={!isEditing}
                        />

                        <TextInput
                            label="Telefonszám"
                            {...form.getInputProps('phone')}
                            disabled={!isEditing}
                        />

                        {isEditing && (
                            <>
                                <PasswordInput
                                    label="Jelenlegi jelszó"
                                    {...form.getInputProps('currentPassword')}
                                />

                                <PasswordInput
                                    label="Új jelszó"
                                    {...form.getInputProps('newPassword')}
                                />

                                <PasswordInput
                                    label="Új jelszó megerősítése"
                                    {...form.getInputProps('confirmPassword')}
                                />
                            </>
                        )}

                        <Group justify="flex-end" mt="md">
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)}>
                                    Szerkesztés
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            if (userData) form.setValues(userData);
                                        }}
                                    >
                                        Mégse
                                    </Button>
                                    <Button
                                        type="submit"
                                        loading={loading}
                                    >
                                        Mentés
                                    </Button>
                                </>
                            )}
                        </Group>
                    </Stack>
                </form>
            </Paper>
            <Paper shadow="xs" p="md" mt="xl">
    <Title order={2} mb="md">Rendelések</Title>
    <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Rendelés azonosító</Table.Th>
                <Table.Th>Rendelés dátuma</Table.Th>
                <Table.Th>Lezárás dátuma</Table.Th>
                <Table.Th>Termékek</Table.Th>
                <Table.Th>Státusz</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
        {orders.map((order) => (
    <Table.Tr key={order.id}>
        <Table.Td>{order.id}</Table.Td>
        <Table.Td>
            {formatDate(order.PlacedAt ? order.PlacedAt.toString() : '')}
        </Table.Td>
        <Table.Td>
            {formatDate(order.ClosedAt ? order.ClosedAt.toString() : '')}
        </Table.Td>
        <Table.Td>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {order.items.map((item, index) => (
                    <li key={index}>
                        {item.ProductName} ({item.Quantity} db)
                    </li>
                ))}
            </ul>
        </Table.Td>
        <Table.Td>{order.Status}</Table.Td>
        <Table.Td>
            <Button>Törlés</Button>
        </Table.Td>
    </Table.Tr>
))}
    </Table.Tbody>
    </Table>
    </Paper>
    </Container>
    );
};

export default Profile;
