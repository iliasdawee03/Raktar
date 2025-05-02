export interface IDeliveryFormCreate {
    supplierId: number;
    expectedDeliveryDate: Date;
    deliveredProducts: {
        productId: number;
        productName: string;  
        quantity: number;
    }[];
}