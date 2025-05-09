import { IOrderItemCreate } from "./IOrderItemCreate";

export interface IOrderCreate {
    customerId: number;
    items : IOrderItemCreate[];
}