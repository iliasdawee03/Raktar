export interface IDeliveryFormRead {
    id ?: number;
    supplierId ?: number;
    expectedDeliveryDate ?: Date;
    createdAt ?: Date;
    status ?: string;
    deliveredProducts : {
        productId : number;
        productName : string;  
        quantity : number;
    }[];
}