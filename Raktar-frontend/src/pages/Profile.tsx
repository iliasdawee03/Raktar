import { useState, useContext } from 'react';
import { 
    Container, 
    Title, 
    TextInput, 
    Button, 
    Paper, 
    Stack,
    PasswordInput,
    Group,
    Text
} from "@mantine/core";
import { AuthContext } from '../context/AuthContext';
import { useForm } from '@mantine/form';
import api from '../api/api';

interface ProfileFormValues {
    email: string;
    name: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const Profile = () => {
    const { email } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<ProfileFormValues>({
        initialValues: {
            email: email || '',
            name: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Érvénytelen email cím'),
            newPassword: (value) => value.length < 6 ? 'A jelszó minimum 6 karakter hosszú legyen' : null,
            confirmPassword: (value, values) => 
                value !== values.newPassword ? 'A jelszavak nem egyeznek' : null,
        }
    });

    const handleSubmit = async (values: ProfileFormValues) => {
        try {
            setLoading(true);
            // Itt hívd meg az API-t a profil frissítéséhez
            // await api.User.updateProfile(values);
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
                                        onClick={() => setIsEditing(false)}
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
        </Container>
    );
};

export default Profile;