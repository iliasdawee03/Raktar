import { IOrderItemCreate } from "./IOrderItemCreate";

export interface IOrderUpdate {
    status : string;
    carrierId?: number;
    items : IOrderItemCreate[];
}