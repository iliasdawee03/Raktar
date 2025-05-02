export interface IUserCreate {
    username : string;
    email : string;
    password : string;
    phoneNumber : number;
    role : UserRole;
}
export enum UserRole {
    Customer = 1,
    Supplier = 2,
    Carrier = 3,
    WarehouseStaff = 4,
    Admin = 5
}