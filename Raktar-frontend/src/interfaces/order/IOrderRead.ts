import { IOrderItemRead } from "./IOrderItemRead";

export interface IOrderRead {
    id: number;
    customerId: number;
    placedAt: string;
    closedAt? : string;
    Status: string | null;
    items : IOrderItemRead[]
}