import { IOrderItemRead } from "./IOrderItemRead";

export interface IOrderRead {
    Id: number;
    CustomerId: number;
    PlacedAt: string;
    ClosedAt? : string;
    CarrierId? : number;
    Status: string | null;
    Items : IOrderItemRead[]
}