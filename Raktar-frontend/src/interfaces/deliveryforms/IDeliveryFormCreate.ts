import { IDeliveredProductCreate } from "../deliveredproducts/IDeliveryProductCreate";

export interface IDeliveryFormCreate {
    supplierId: number;
    expectedDeliveryDate: Date;
    deliveredProducts: IDeliveredProductCreate[]; // Array of delivered products
}