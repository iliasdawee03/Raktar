export interface IDeliveryFormRead {
    id : number;
    productId : number;
    productName : string;
    quantity : number;
    locationId : LocationCode;
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