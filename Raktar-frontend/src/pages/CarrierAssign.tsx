import { useEffect, useState } from "react";
import { Table, Container, Title, Select, Button, Group } from "@mantine/core";
import api from "../api/api";
import { IOrderRead } from "../interfaces/order/IOrderRead";
import { IWarehouseStorageRead } from "../interfaces/warehouse/IWarehouseStorageRead";
import { IWarehouseStorageCreate, LocationCode } from "../interfaces/warehouse/IWarehouseStorageCreate";
import { IUserRead } from "../interfaces/user/IUserRead";
import { ITransportCreate } from "../interfaces/transport/ITransportCreate";


const CarrierAssign = () => {
  const [orders, setOrders] = useState<IOrderRead[]>([]);
  const [warehouseItems, setWarehouseItems] = useState<IWarehouseStorageRead[]>([]);
  const [carriers, setCarriers] = useState<IUserRead[]>([]);
  const [selection, setSelection] = useState<Record<string, { locationCode: keyof typeof LocationCode, carrierId: number | null }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Pending rendelések
      const ordersResp = await api.Orders.getAll();
      const pendingOrders = (Array.isArray(ordersResp.data) ? ordersResp.data : []).filter(order => order.status === "Pending");
      setOrders(pendingOrders);

      // Raktárkészlet
      const warehouseResp = await api.Warehouse.getAll();
      setWarehouseItems(Array.isArray(warehouseResp.data) ? warehouseResp.data : []);

      // Futárok (role: 2)
      const usersResp = await api.User.getAll();
      setCarriers((Array.isArray(usersResp.data) ? usersResp.data : []).filter(u => u.role === 2));

      setLoading(false);
    };
    fetchData();
  }, []);

  // Segédfüggvény: egy adott termékhez milyen helyeken van elég készlet
  const getAvailableLocations = (productId: number, requiredQty: number) =>
    warehouseItems.filter(item => item.productId === productId && item.quantity >= requiredQty);

  // Kiválasztás kezelése
  const handleSelectChange = (orderId: number, productId: number, locationCode: string | null) => {
    setSelection(prev => ({
      ...prev,
      [`${orderId}_${productId}`]: {
        ...prev[`${orderId}_${productId}`],
        locationCode: locationCode as keyof typeof LocationCode,
      }
    }));
  };

  const handleCarrierChange = (orderId: number, carrierId: string | null) => {
    setSelection(prev => ({
      ...prev,
      [`${orderId}`]: {
        ...prev[`${orderId}`],
        carrierId: carrierId ? Number(carrierId) : null,
      }
    }));
  };

  // Kiadás és hozzárendelés kezelése
  const handleAssign = async (order: IOrderRead) => {
    // Ellenőrzés: minden tételhez van kiválasztott location, van carrier
    for (const item of order.items) {
      const sel = selection[`${order.id}_${item.productId}`];
      if (!sel || !sel.locationCode) {
        alert("Minden termékhez válassz tárhelyet!");
        return;
      }
    }
    const carrierId = selection[`${order.id}`]?.carrierId;
    if (!carrierId) {
      alert("Válassz futárt!");
      return;
    }

    try {
      // 1. Storage-ból levonás
      await Promise.all(order.items.map(item => {
        const sel = selection[`${order.id}_${item.productId}`];
        return api.Warehouse.assign({
          ProductId: item.productId,
          Quantity: -item.quantity, // Negatív, hogy kivonja!
          LocationCode: LocationCode[sel.locationCode],
        } as IWarehouseStorageCreate);
      }));

      // 2. Order státusz update
      await api.Orders.update(order.id, {
    status: "At Carrier",
    carrierId: carrierId,
    items: order.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
  }))
});

      // 3. Transport létrehozás
      await api.Transport.create({
        orderId: order.id,
        carrierId: carrierId,
        status: "Assigned"
      } as ITransportCreate);

      alert("Sikeres hozzárendelés!");
      // Frissítsd a listát
      setOrders(orders => orders.filter(o => o.id !== order.id));
    } catch (err) {
      alert("Hiba történt a hozzárendelés során!");
      console.error(err);
    }
  };

  if (loading) return <Container>Betöltés...</Container>;

  return (
    <Container>
      <Title order={2} mb="md">Rendelések hozzárendelése futárhoz</Title>
      {orders.length === 0 ? (
        <div>Nincs teljesítendő rendelés.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ marginBottom: 32 }}>
            <Title order={4} mb="xs">Rendelés #{order.id}</Title>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Termék ID</Table.Th>
                  <Table.Th>Szükséges mennyiség</Table.Th>
                  <Table.Th>Tárhely</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {order.items.map(item => {
                  const locations = getAvailableLocations(item.productId, item.quantity);
                  const sel = selection[`${order.id}_${item.productId}`] || {};
                  return (
                    <Table.Tr key={item.productId}>
                      <Table.Td>{item.productId}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>
                        <Select
                          data={locations.map(loc => ({
                            value: Object.keys(LocationCode).find(key => LocationCode[key as any] === (loc.locationCode as any)) || "",
                            label: Object.keys(LocationCode).find(key => LocationCode[key as any] === (loc.locationCode as any)) || ""
                          }))}
                          value={sel.locationCode || null}
                          onChange={value => handleSelectChange(order.id!, item.productId, value)}
                          placeholder="Válassz tárhelyet"
                        />
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
            <Group mt="md">
              <Select
                label="Futár"
                data={carriers.map(carrier => ({
                  value: carrier.id.toString(),
                  label: `${carrier.name} (ID: ${carrier.id})`
                }))}
                value={selection[`${order.id}`]?.carrierId?.toString() || null}
                onChange={value => handleCarrierChange(order.id!, value)}
                placeholder="Válassz futárt"
                style={{ minWidth: 220 }}
              />
              <Button
                onClick={() => handleAssign(order)}
                disabled={
                  !order.items.every(item => selection[`${order.id}_${item.productId}`]?.locationCode) ||
                  !selection[`${order.id}`]?.carrierId
                }
              >
                Assign
              </Button>
            </Group>
          </div>
        ))
      )}
    </Container>
  );
};

export default CarrierAssign;