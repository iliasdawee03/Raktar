import { useEffect, useState } from "react";
import { Table, Container, Title } from "@mantine/core";
import api from "../api/api";
import { IWarehouseStorageRead } from "../interfaces/warehouse/IWarehouseStorageRead";
import { LocationCode } from "../interfaces/warehouse/IWarehouseStorageCreate";

const StorageView = () => {
  const [items, setItems] = useState<IWarehouseStorageRead[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const response = await api.Warehouse.getAll();
      setItems(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    };
    fetchItems();
  }, []);

  // Csoportosítás locationCode szerint
  const grouped = Object.keys(LocationCode)
    .filter(key => isNaN(Number(key))) // csak enum kulcsok
    .map(key => ({
      code: key,
      items: items.filter(item => (LocationCode as any)[key] === item.locationCode)
    }));

  return (
    <Container>
      <Title order={2} mb="md">Raktárkészlet helyenként</Title>
      {isLoading ? (
        <div>Betöltés...</div>
      ) : (
        grouped.map(group => (
          <div key={group.code} style={{ marginBottom: 32 }}>
            <Title order={4} mb="xs">{group.code}</Title>
            {group.items.length === 0 ? (
              <div>Nincs termék ezen a helyen.</div>
            ) : (
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Termék ID</Table.Th>
                    <Table.Th>Mennyiség</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {group.items.map(item => (
                    <Table.Tr key={item.productId}>
                      <Table.Td>{item.productId}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </div>
        ))
      )}
    </Container>
  );
};

export default StorageView;