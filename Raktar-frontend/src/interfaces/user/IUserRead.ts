export interface IUserRead {
    id: number;
    name: string;
    email: string;
    phone: number;
    role: UserRole;
}
export enum UserRole {
    Customer = 0,
    Supplier = 1,
    Carrier = 2,
    WarehouseStaff = 3,
    Admin = 4
}