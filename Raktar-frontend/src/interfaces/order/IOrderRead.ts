import { IOrderItemRead } from "./IOrderItemRead";

export interface IOrderRead {
    id: number;
    customerId: number;
    placedAt: string;
    closedAt? : string;
    carrierId? : number;
    status: string | null;
    items : IOrderItemRead[]
}