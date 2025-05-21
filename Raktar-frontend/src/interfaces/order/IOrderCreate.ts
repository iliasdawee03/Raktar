import { IOrderItemCreate } from "./IOrderItemCreate";

export interface IOrderCreate {
    CustomerId: number;
    CarrierId?: number;
    Items : IOrderItemCreate[];
}