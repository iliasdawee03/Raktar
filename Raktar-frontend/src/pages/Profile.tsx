import { useState, useContext, useEffect, useMemo } from 'react';
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
    Badge,
} from "@mantine/core";
import { AuthContext } from '../context/AuthContext';
import { useForm } from '@mantine/form';
import api from '../api/api';
import { IOrderRead } from '../interfaces/order/IOrderRead';
import { IUserRead, UserRole } from '../interfaces/user/IUserRead';
import { useNavigate } from 'react-router-dom';

interface ProfileFormValues {
    name: string;
    email: string;
    phone: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const Profile = () => {
    const navigate = useNavigate();
    const { email } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [userData, setUserData] = useState<ProfileFormValues | null>(null);
    const [orders, setOrders] = useState<IOrderRead[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

    const Complaint = (order : IOrderRead) => {
        navigate('/dashboard/complaint', {state: { selectedOrder: order, userId: userId }});
    };

    const updateValidation = (order : IOrderRead) => {
        const currentDate = new Date();
        const closedDate = new Date(String(order.closedAt));
        if(closedDate && closedDate > currentDate && order.status ==  "Open" || order.status == "Pending")
        {
            navigate('/dashboard/orderupdate', {
                state: { selectedOrder: order }
            });
        } else {
            alert("A rendelés már lezárult, nem módosítható!");
        }
    };

    const formatDate = (input: unknown): string => {
        if (!input) return '-';

        let date: Date;

        if (typeof input === 'string' || typeof input === 'number') {
            date = new Date(input);
        } else if (typeof input === 'object' && input !== null && 'date' in input) {
            date = new Date((input as any).date);
        } else if (input instanceof Date) {
            date = input;
        } else {
            return '-';
        }

        if (isNaN(date.getTime())) return '-';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');

        return `${year}. ${month}. ${day}. ${hour}:${minute}`;
    };

const initialFormValues = useMemo(() => ({
    email: '',
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
}), []);

    const validateForm = useMemo(() => ({
        email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Érvénytelen email cím'),
        newPassword: (value: string | undefined, values: ProfileFormValues) =>
            values.newPassword && values.newPassword.length < 6
                ? 'A jelszó minimum 6 karakter hosszú legyen'
                : null,
        confirmPassword: (value: string | undefined, values: ProfileFormValues) =>
            values.newPassword && value !== values.newPassword
                ? 'A jelszavak nem egyeznek'
                : null,
    }), []);

    const form = useForm<ProfileFormValues>({
        initialValues: initialFormValues,
        validate: validateForm,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.User.getAll();
                const user: IUserRead | undefined = response.data.find(u => u.email === email);

                console.log("User ID:", user?.id);
                if (user) {
                    console.log("Talált felhasználó:", {
                        id: user.id,
                        email: user.email,
                        typeof_id: typeof user.id,
                        role: user.role
                    });

                    setUserId(user.id);
                    setCurrentUserRole(user.role);

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

                    if(user.role === UserRole.Customer || user.role === UserRole.Admin)
                    {
                    const ordersResponse = await api.Orders.getAll();
                    console.log("Orders response:", ordersResponse.data);
                    const userOrders = ordersResponse.data
                        .filter((order: IOrderRead) => order.customerId === user.id);
                    console.log("Szűrt rendelések:", userOrders);
                    setOrders(userOrders);
                    }
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
    }, [email]);

    const handleSubmit = async (values: ProfileFormValues) => {
        try {
            setLoading(true);

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
        <Container>
            <Paper shadow="xs" p="md" mt="md" style={{ minWidth: '1100px' }}>
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
            {(currentUserRole === UserRole.Admin || currentUserRole === UserRole.Customer) && (
                <Paper shadow="xs" mt="xl" style={{ minWidth: '1100px' }}>
                    <Title order={2} mb="md" p="10px">Rendelések</Title>
                    <Table style={{tableLayout: 'fixed', width: '100%'}}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ width: '150px' }}>Rendelés ID</Table.Th>
                                <Table.Th style={{ width: '170px' }}>Rendelés dátuma</Table.Th>
                                <Table.Th style={{ width: '170px' }}>Módosítható eddig</Table.Th>
                                <Table.Th style={{ width: '250px' }}>Termékek</Table.Th>
                                <Table.Th style={{ width: '120px' }}>Státusz</Table.Th>
                                <Table.Th style={{ width: '120px' }}></Table.Th> 
                                <Table.Th style={{ width: '120px' }}></Table.Th> 
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                        {orders.map((order) => (
                    <Table.Tr key={order.id}>
                        <Table.Td>{order.id}</Table.Td>
                            <Table.Td>{order.placedAt ? formatDate(order.placedAt) : "-"}</Table.Td>
                            <Table.Td>{order.closedAt ? formatDate(order.closedAt) : '-'}</Table.Td>
                        <Table.Td>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                {order.items.map((item, index) => (
                                    <li key={index}>
                                        {item.productName} ({item.quantity} db)
                                    </li>
                                ))}
                            </ul>
                        </Table.Td>
                        <Table.Td>
                        <Badge
                            color={
                                !order.status || order.status === 'null' ? 'yellow' :
                                order.status === 'Closed' ? 'red' :
                                'green'
                            }
                        >
                            {!order.status || order.status === 'null' ? 'pending' :
                            order.status === 'Closed' ? 'closed' :
                            order.status}
                        </Badge>
                    </Table.Td>
                        <Table.Td>
                            <Button onClick={() => updateValidation(order)}>Módosítás</Button>
                        </Table.Td>
                        <Table.Td>
                            <Button onClick={() => Complaint(order)}>
                                Panasz
                            </Button>
                        </Table.Td>
                    </Table.Tr>
                ))}
                    </Table.Tbody>
                    </Table>
                </Paper>
            )}
        </Container>
    );
};

export default Profile;