export interface IUserRead {
    id: number;
    name: string;
    email: string;
    phone: number;
    role: UserRole;
}
export enum UserRole {
    Customer = 1,
    Supplier = 2,
    Carrier = 3,
    WarehouseStaff = 4,
    Admin = 5
}