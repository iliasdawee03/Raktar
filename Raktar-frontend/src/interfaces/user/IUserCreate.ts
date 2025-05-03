export interface IUserCreate {
    username : string;
    email : string;
    password : string;
    phoneNumber : number;
    role : UserRole;
}
export enum UserRole {
    Customer = 0,
    Supplier = 1,
    Carrier = 2,
    WarehouseStaff = 3,
    Admin = 4
}