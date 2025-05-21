import { IOrderItemCreate } from "./IOrderItemCreate";

export interface IOrderUpdate {
    Status : string;
    CarrierId?: number;
    Items : IOrderItemCreate[];
}