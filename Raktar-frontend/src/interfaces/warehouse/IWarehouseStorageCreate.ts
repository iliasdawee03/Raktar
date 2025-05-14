export interface IWarehouseStorageCreate {
    ProductId: number;
    Quantity: number;
    LocationCode : LocationCode;
}
export enum LocationCode {
    E1,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8,
    E9,
}