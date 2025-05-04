import { IOrderItemCreate } from "./IOrderItemCreate";

export interface IOrderCreate {
    CustomerId: number;
    items : IOrderItemCreate[];
}