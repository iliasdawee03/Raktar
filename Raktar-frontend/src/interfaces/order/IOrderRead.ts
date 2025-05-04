import { IOrderItemRead } from "./IOrderItemRead";

export interface IOrderRead {
    id: number;
    CustomerId: number;
    PlacedAt: Date;
    ClosedAt? : Date;
    Status: string;
    items : IOrderItemRead[]
}