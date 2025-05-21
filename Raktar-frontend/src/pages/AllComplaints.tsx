import { useEffect, useState } from 'react';
import { Container, Title, Table, Loader, Text } from '@mantine/core';
import api from '../api/api';
import { IComplaintRead } from '../interfaces/complaint/IComplaintRead';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState<IComplaintRead[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const response = await api.Complaint.getAll(); // Note: using Complaint, not Complaints
        if (Array.isArray(response.data)) {
          setComplaints(response.data);
          console.log("Fetched complaints:", response.data); // Debug log
        } else {
          console.log("Response is not an array:", response.data); // Debug log
          setComplaints([]);
        }
      } catch (error) {
        console.error("Hiba a panaszok lekérése közben:", error);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      <Title order={2} mb="md">Panaszok listája</Title>
      {complaints.length === 0 ? (
        <Text>Nincsenek panaszok.</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Azonosító</Table.Th>
              <Table.Th>Rendelés ID</Table.Th>
              <Table.Th>Felhasználó ID</Table.Th>
              <Table.Th>Leírás</Table.Th>
              <Table.Th>Státusz</Table.Th>
              <Table.Th>Létrehozva</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {complaints.map((complaint) => (
              <Table.Tr key={complaint.id}>
                <Table.Td>{complaint.id}</Table.Td>
                <Table.Td>{complaint.orderId}</Table.Td>
                <Table.Td>{complaint.userId}</Table.Td>
                <Table.Td>{complaint.description}</Table.Td>
                <Table.Td>{complaint.status}</Table.Td>
                <Table.Td>
                  {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : ''}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Container>
  );
};

export default ComplaintList;