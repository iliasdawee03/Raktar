import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Title,
    TextInput,
    PasswordInput,
    Button,
    Group,
    Alert,
    LoadingOverlay,
    Stack,
    NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { IUserCreate, UserRole } from '../interfaces/user/IUserCreate';
import api from '../api/api';


type RegisterFormValues = Omit<IUserCreate, 'role' | 'phoneNumber'> & { phoneNumber: number | null };

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({ 
        initialValues: {
            username: '',
            email: '',
            password: '',
            phoneNumber: null, 
        },
        validate: {
            username: (value) => (value.trim().length < 3 ? 'A felhasználónév legalább 3 karakter hosszú legyen.' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Érvénytelen email cím.'),
            password: (value) => (value.length < 6 ? 'A jelszó legalább 6 karakter hosszú legyen.' : null),
            phoneNumber: (value) => { 
                if (value === null || value === undefined) {
                    return 'A telefonszám megadása kötelező.'; 
                }
                if (String(value).length < 7) {
                    return 'Adjon meg egy érvényes telefonszámot (legalább 7 számjegy).';
                }
                return null;
            },
        },
    });

    const handleSubmit = async (values: RegisterFormValues) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (values.phoneNumber === null) {
            setError('A telefonszám érvénytelen. Kérjük, ellenőrizze a megadott értéket.');
            setLoading(false);
            return;
        }

        const registrationData: IUserCreate = {
            username: values.username,
            email: values.email,
            password: values.password,
            phoneNumber: values.phoneNumber,                         
            role: UserRole.Customer,
        };

        try {
            const response = await api.User.create(registrationData);
            console.log("Sikeres regisztráció:", response.data);

            setSuccess('Sikeres regisztráció! Most már bejelentkezhet.');
            form.reset();
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            console.error("Hiba a regisztráció során:", err);
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'object' && err.response.data.errors) {
                    const errorMessages = Object.values(err.response.data.errors).flat().join('\n');
                    setError(errorMessages || 'Hiba történt a regisztráció során.');
                } else if (err.response.data.message) {
                    setError(err.response.data.message);
                } else if (typeof err.response.data === 'string') {
                    setError(err.response.data);
                } else {
                    setError('Ismeretlen hiba történt a regisztráció során.');
                }
            } else {
                setError(err.message || 'Hiba történt a regisztráció során.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="xs" mt="xl" mb="xl">
            <Paper shadow="md" p="lg" radius="md" withBorder>
                <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
                <Title order={2} ta="center" mb="xl">
                    Regisztráció
                </Title>

                {error && (
                    <Alert icon={<IconAlertCircle size="1rem" />} title="Hiba!" color="red" withCloseButton onClose={() => setError(null)} mb="md" style={{ whiteSpace: 'pre-line' }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert icon={<IconCircleCheck size="1rem" />} title="Siker!" color="green" withCloseButton onClose={() => setSuccess(null)} mb="md">
                        {success}
                    </Alert>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Felhasználónév"
                            placeholder="Adja meg a felhasználónevét"
                            required
                            {...form.getInputProps('username')}
                            disabled={loading || !!success}
                        />
                        <TextInput
                            label="Email cím"
                            placeholder="email@example.com"
                            required
                            type="email"
                            {...form.getInputProps('email')}
                            disabled={loading || !!success}
                        />
                        <PasswordInput
                            label="Jelszó"
                            placeholder="Adja meg a jelszavát"
                            required
                            {...form.getInputProps('password')}
                            disabled={loading || !!success}
                        />
                        <NumberInput
                            label="Telefonszám"
                            placeholder="Adja meg a telefonszámát"
                            required
                            hideControls
                            allowDecimal={false}
                            allowNegative={false}
                            {...form.getInputProps('phoneNumber')}
                            disabled={loading || !!success}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button
                                type="submit"
                                loading={loading}
                                disabled={!!success}
                            >
                                Regisztráció
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default RegisterPage;