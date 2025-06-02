import { IOrderItemCreate } from "./IOrderItemCreate";

export interface IOrderCreate {
    customerId: number;
    carrierId?: number;
    items : IOrderItemCreate[];
}