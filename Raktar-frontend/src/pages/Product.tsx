import { useEffect,useState } from "react";
import {Table,Container,Title, Loader,Text, Button} from "@mantine/core";
import { IProductRead } from "../interfaces/product/IProductRead";
import api from "../api/api.ts";
import { useNavigate } from "react-router-dom";


const Product = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<IProductRead[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleOrder = (product: IProductRead) => {
        navigate('/dashboard/order', { 
            state: { selectedProduct: product }
        });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.Products.getAll();
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to fetch products. Please try again later.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if(isLoading){
        return <Loader/>;
    }
    if(error){
        return <Text color="red">{error}</Text>;
    }
    return (
        <Container>
            <Title order={1} mb={"md"}>Termékek</Title>
            <Table>
                <Table.Thead>   
                    <Table.Tr>
                        <Table.Th>Név</Table.Th>
                        <Table.Th>Leírás</Table.Th>
                        <Table.Th>Ár</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {products.map((product) => (
                        <Table.Tr key={product.id}>
                            <Table.Td>{product.name}</Table.Td>
                            <Table.Td>{product.description}</Table.Td>
                            <Table.Td>{product.price} Ft</Table.Td>
                            <Table.Td>
                            <Button 
                                    variant="outline" 
                                    color="blue" 
                                    onClick={() => handleOrder(product)}
                                >
                                    Rendelés
                                </Button>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    );
}
export default Product;