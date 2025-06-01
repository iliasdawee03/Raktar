import { useContext, useEffect, useState } from 'react';
import { Container, Title, Table, Loader, Text, Checkbox, Button, Group } from '@mantine/core';
import api from '../api/api';
import { ITransportRead } from '../interfaces/transport/ITransportRead';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { IOrderItemCreate } from '../interfaces/order/IOrderItemCreate';

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
            await api.Orders.update(t.orderId, {
              status: "Closed",
              items: [],
            });
            await api.Transport.updateStatus(t.id, "Closed", new Date());
          })
      );
      alert("Szállítások lezárva!");
      setTransports((prev) =>
        prev.map((t) =>
          selected.includes(t.id) ? { ...t, status: "Closed", endDate: new Date() } : t
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
        .filter((t) => selected.includes(t.id))
        .map(async (t) => {
          let itemsForUpdate: IOrderItemCreate[] = [];
          try {
            // 1. Rendelés aktuális tételeinek lekérdezése
            // Cseréld le 'api.Orders.getById' -t a tényleges API hívásodra
            const orderDetailsResponse = await api.Orders.getById(t.orderId); 

            if (orderDetailsResponse && orderDetailsResponse.data && orderDetailsResponse.data.items) {
              // 2. Tételek átalakítása IOrderItemCreate[] formátumra
              // Ez a mappolás függ a meglévő item struktúrától és az IOrderItemCreate definíciójától
              itemsForUpdate = orderDetailsResponse.data.items.map((item: any) => {
                // Ellenőrizd, hogy az 'item' objektum milyen mezőkkel rendelkezik,
                // és az IOrderItemCreate milyen mezőket vár.
                // Példa feltételezve, hogy productId és quantity szükséges:
                if (typeof item.productId === 'number' && typeof item.quantity === 'number') {
                  return {
                    productId: item.productId,
                    quantity: item.quantity,
                    // ... egyéb IOrderItemCreate mezők, ha vannak
                  };
                }
                // Ha a mappelés nem egyértelmű, vagy hiányoznak adatok, hibát dobhatsz
                // vagy kihagyhatod az elemet, de ez adatvesztéshez vezethet.
                // Fontos, hogy itt helyes IOrderItemCreate objektumok jöjjenek létre.
                console.warn(`Skipping item due to missing data for order ${t.orderId}:`, item);
                return null;
              }).filter(item => item !== null) as IOrderItemCreate[]; // Kiszűrjük a null elemeket

              if (itemsForUpdate.length === 0 && orderDetailsResponse.data.items.length > 0) {
                // Ha voltak eredeti itemek, de a mappelés után egy sem maradt, az hiba lehet
                console.error(`Failed to map items for order ${t.orderId}. Original items:`, orderDetailsResponse.data.items);
                // Dönthetsz úgy, hogy itt hibát dobsz, hogy ne küldj üres Items tömböt, ha nem kellene.
                // throw new Error(`Failed to map items for order ${t.orderId}`);
              }

            } else {
              console.warn(`Could not fetch items for order ${t.orderId} or order has no items. Sending empty Items array if that's intended.`);
              // Ha egy rendelésnek lehetnek tételei, de itt nem sikerült lekérni, az problémát jelezhet.
              // Ha a backend megköveteli a tételeket "In Transit" státuszhoz, akkor itt hibát kellene kezelni.
            }
          } catch (fetchError) {
            console.error(`Error fetching or mapping items for order ${t.orderId}:`, fetchError);
            // Itt eldöntheted, hogy megszakítod-e a frissítést ennél a rendelésnél,
            // vagy megpróbálod üres 'itemsForUpdate' tömbbel (ami valószínűleg ugyanazt a 400-as hibát okozza).
            // A biztonság kedvéért dobhatsz egy hibát, hogy ne folytatódjon hibás adatokkal.
            throw new Error(`Failed to prepare items for order update ${t.orderId}: ${fetchError}`);
          }

          await api.Orders.update(t.orderId, {
            status: "In Transit",
            ...(userId !== null ? { carrierId: userId } : {}),
            items: itemsForUpdate, // Elküldjük a (remélhetőleg) helyesen formázott tételeket
          });
          await api.Transport.updateStatus(t.id, "In Transit");
        })
    );
    alert("Státusz frissítve!");
    setTransports((prev) =>
      prev.map((t) =>
        selected.includes(t.id) ? { ...t, status: "In Transit" } : t
      )
    );
    setSelected([]);
  } catch (err) {
    // A belső hibadobásokat itt kapod el
    alert(`Hiba történt a státusz frissítésekor: ${err.message || 'Ismeretlen hiba'}`);
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