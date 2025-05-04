import { IDeliveredProductRead } from "../deliveredproducts/IDeliveredProductRead";

export interface IDeliveryFormRead {
    id ?: number;
    supplierId ?: number;
    expectedDeliveryDate ?: Date;
    createdAt ?: Date;
    status ?: string;
    deliveredProducts :IDeliveredProductRead[];
}