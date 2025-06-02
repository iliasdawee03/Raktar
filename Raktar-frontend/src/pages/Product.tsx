import { useEffect, useState } from "react";
import { Table, Container, Title, Loader, Text, Button, Checkbox, NumberInput, Group } from "@mantine/core";
import { IProductRead } from "../interfaces/product/IProductRead";
import api from "../api/api.ts";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation hozzáadva
import { IOrderItemCreate } from "../interfaces/order/IOrderItemCreate";


const Product = () => {
    const navigate = useNavigate();
    const location = useLocation(); // useLocation hook használata
    const [products, setProducts] = useState<IProductRead[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState<Map<number, { quantity: number; product: IProductRead }>>(new Map());

    // useEffect a termékek lekérésére (változatlan)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.Products.getAll();
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Új useEffect a 'selectedOrderItems' inicializálására a location.state alapján,
    // miután a 'products' betöltődött.
    useEffect(() => {
        const stateFromOrderPage = location.state as { currentOrderState?: IOrderItemCreate[] } | null;

        if (stateFromOrderPage?.currentOrderState && products.length > 0) {
            const newSelectedItems = new Map<number, { quantity: number; product: IProductRead }>();
            stateFromOrderPage.currentOrderState.forEach(itemFromState => {
                const productDetails = products.find(p => p.id === itemFromState.productId);
                if (productDetails) {
                    newSelectedItems.set(itemFromState.productId, {
                        quantity: itemFromState.quantity,
                        product: productDetails
                    });
                }
            });
            setSelectedOrderItems(newSelectedItems);

            // Fontos: Töröljük a state-et a location objektumból, miután felhasználtuk,
            // hogy ne alkalmazza újra pl. egy böngésző frissítés vagy más navigáció után.
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [products, location.state, navigate]); // Figyeljük a products, location.state és navigate változását


    const handleCheckboxChange = (product: IProductRead, checked: boolean) => {
        // ... (változatlan) ...
        setSelectedOrderItems(prevMap => {
            const newMap = new Map(prevMap);
            if (checked) {
                if (!newMap.has(product.id)) {
                    newMap.set(product.id, { quantity: 1, product }); 
                }
            } else {
                newMap.delete(product.id);
            }
            return newMap;
        });
    };

    const handleQuantityChange = (productId: number, quantity: number | string) => {
        // ... (változatlan) ...
        const numQuantity = Number(quantity);
        setSelectedOrderItems(prevMap => {
            const newMap = new Map(prevMap);
            const item = newMap.get(productId);
            if (item) {
                newMap.set(productId, { ...item, quantity: numQuantity });
            }
            return newMap;
        });
    };

    const handleProceedToOrder = () => {
        // ... (változatlan, de az IOrderItemCreate most már nem tartalmaz productName-t és unitPrice-t
        // ha az interfész definíciója szerint csak productId és quantity van benne) ...
        const orderItemsToPass: IOrderItemCreate[] = []; 
        selectedOrderItems.forEach((value) => { 
            if (value.quantity > 0) {
                orderItemsToPass.push({
                 // Ezt a mezőt eltávolíthatod, ha nem szükséges
                    productId: value.product.id,
                    quantity: value.quantity,
                });
            }
        });

        if (orderItemsToPass.length > 0) {
            navigate('/dashboard/order', { 
                state: { orderItems: orderItemsToPass }
            });
        } else {
            alert("Nincsenek rendelésre kiválasztott termékek, vagy a megadott mennyiség 0.");
        }
    };

    // ... (JSX renderelés változatlan) ...
    if (isLoading) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)' }}>
                <Loader />
            </Container>
        );
    }

    if (error) {
        return (
            <Container mt="lg">
                <Text c="red" ta="center">{error}</Text>
            </Container>
        );
    }

    const isProductSelected = (productId: number) => selectedOrderItems.has(productId);
    const getQuantityForProduct = (productId: number) => selectedOrderItems.get(productId)?.quantity ?? 0;

    return (
        <Container>
            <Title order={1} mb={"md"}>Termékek</Title>
            {products.length > 0 ? (
                <>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ width: '50px' }}>Kiv.</Table.Th>
                                <Table.Th>Név</Table.Th>
                                <Table.Th>Leírás</Table.Th>
                                <Table.Th>Ár</Table.Th>
                                <Table.Th style={{ width: '120px' }}>Mennyiség</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {products.map((product) => (
                                <Table.Tr key={product.id}>
                                    <Table.Td>
                                        <Checkbox
                                            checked={isProductSelected(product.id)}
                                            onChange={(event) => handleCheckboxChange(product, event.currentTarget.checked)}
                                        />
                                    </Table.Td>
                                    <Table.Td>{product.name}</Table.Td>
                                    <Table.Td>{product.description}</Table.Td>
                                    <Table.Td>{product.price} Ft</Table.Td>
                                    <Table.Td>
                                        <NumberInput
                                            value={getQuantityForProduct(product.id)}
                                            onChange={(value) => handleQuantityChange(product.id, value)}
                                            min={0}
                                            disabled={!isProductSelected(product.id)}
                                            placeholder="Db"
                                            size="xs"
                                        />
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <Group justify="flex-end" mt="xl">
                        <Button
                            onClick={handleProceedToOrder}
                            disabled={Array.from(selectedOrderItems.values()).filter(item => item.quantity > 0).length === 0}
                        >
                            Tovább a rendeléshez ({Array.from(selectedOrderItems.values()).filter(item => item.quantity > 0).length})
                        </Button>
                    </Group>
                </>
            ) : (
                <Text mt="md" ta="center">Jelenleg nincsenek elérhető termékek.</Text>
            )}
        </Container>
    );
}
export default Product;