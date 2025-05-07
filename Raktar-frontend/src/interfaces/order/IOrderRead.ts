import { IOrderItemRead } from "./IOrderItemRead";

export interface IOrderRead {
    id: number;
    customerId: number;
    PlacedAt: Date;
    ClosedAt? : Date;
    Status: string;
    items : IOrderItemRead[]
}