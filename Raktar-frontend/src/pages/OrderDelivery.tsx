import { useContext, useEffect, useState } from 'react';
import { Container, Title, Table, Loader, Text, Checkbox, Button, Group } from '@mantine/core';
import api from '../api/api';
import { ITransportRead } from '../interfaces/transport/ITransportRead';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const OrderDelivery = () => {
  const [transports, setTransports] = useState<ITransportRead[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const { email } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await api.User.getAll();
        const user = response.data.find((u: any) => u.email === email);
        if (user) {
          setUserId(user.id);
        } else {
          console.error("Bejelentkezett felhasználó nem található az email alapján:", email);
          alert("Hiba: A felhasználói adatok nem töltődtek be megfelelően. Kérjük, jelentkezzen be újra.");
          navigate('/login');
        }
      } catch (error) {
        console.error("Hiba a felhasználói ID lekérése közben:", error);
        alert("Hiba történt a felhasználói adatok lekérése során.");
      }
    };

    if (email) {
      fetchUserId();
    } else {
      alert("Kérjük, jelentkezzen be a rendelés folytatásához.");
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
     const fetchTransports = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.Transport.getAll();
        console.log("Transports API response:", response.data);
        if (Array.isArray(response.data)) {
          const userTransports = response.data.filter(
            (transport) => 
              transport.carrierId === userId && 
              transport.status !== "Closed"
          );
          console.log("Filtered transports:", userTransports);
          setTransports(userTransports);
        } else {
          setTransports([]);
        }
      } catch (error) {
        console.error("Hiba a szállítások lekérése közben:", error);
        setTransports([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransports();
    }
  }, [userId]);

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const handleClose = async () => {
    try {
      await Promise.all(
        transports
          .filter((t) => selected.includes(t.id))
          .map(async (t) => {
            await api.Orders.updateStatus(t.orderId, { status: "Delivered" });
            await api.Transport.updateStatus(t.id, { status: "Closed", endDate: new Date().toISOString() });
          })
      );
      alert("Szállítások lezárva!");
      setTransports((prev) =>
        prev.map((t) =>
          selected.includes(t.id) ? { ...t, status: "Closed", endDate: new Date()} : t
        )
      );
      setSelected([]);
    } catch (err) {
      alert("Hiba történt a szállítások lezárásakor!");
      console.error(err);
    }
};

const handleInTransit = async () => {
  try {
    await Promise.all(
      transports
        .filter((t) => selected.includes(t.id)) // 1. Csak a kijelölt szállítások
        .map(async (transport) => {
          // 2. A 'transport.orderId' alapján frissítjük a rendelést
          await api.Orders.updateStatus(transport.orderId, { status: "In Transit" });
          // 3. A szállítás státuszát is frissítjük
          await api.Transport.updateStatus(transport.id, { status: "In Transit", endDate: null });
        })
    );

    alert("Státusz frissítve!");
    setTransports((prev) =>
      prev.map((t) =>
        selected.includes(t.id)
          ? { ...t, status: "In Transit", endDate: undefined }
          : t
      )
    );
    setSelected([]);
  } catch (err : unknown) {
    alert(`Hiba történt a státusz frissítésekor: ${err instanceof Error ? err.message : 'Ismeretlen hiba'}`);
    console.error(err); 
  }
};

  if (isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  if (!userId) {
    return (
      <Container>
        <Title order={2} mb="md">
          Szállításaim
        </Title>
        <Text>A szállítások megtekintéséhez jelentkezz be.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Title order={2} mb="md">
        Szállításaim (Futár ID: {userId})
      </Title>
      {transports.length === 0 ? (
        <Text>Nincsenek hozzád rendelt szállítások.</Text>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th></Table.Th>
                <Table.Th>Szállítás ID</Table.Th>
                <Table.Th>Rendelés ID</Table.Th>
                <Table.Th>Státusz</Table.Th>
                <Table.Th>Indulási dátum</Table.Th>
                <Table.Th>Lezárási dátum</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {transports.map((transport) => (
                <Table.Tr key={transport.id}>
                  <Table.Td>
                    <Checkbox
                      checked={selected.includes(transport.id)}
                      onChange={() => handleSelect(transport.id)}
                    />
                  </Table.Td>
                  <Table.Td>{transport.id}</Table.Td>
                  <Table.Td>{transport.orderId}</Table.Td>
                  <Table.Td>{transport.status}</Table.Td>
                  <Table.Td>
                    {transport.startDate ? new Date(transport.startDate).toLocaleString() : ''}
                  </Table.Td>
                  <Table.Td>
                    {transport.endDate ? new Date(transport.endDate).toLocaleString() : ''}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        <Group mt="md">
        <Button
          onClick={handleInTransit}
          disabled={selected.length === 0}
        >
          Kijelöltek "In Transit"-re állítása
        </Button>
        <Button
          onClick={handleClose}
          disabled={selected.length === 0}
          color="red"
        >
          Kijelöltek lezárása
        </Button>
      </Group>
        </>
      )}
    </Container>
  );
};

export default OrderDelivery;