import { IComplaintRead } from "../interfaces/complaint/IComplaintRead";
import {IComplaintCreate} from "../interfaces/complaint/IComplaintCreate";
import axiosInstance from "./axios.config";
import {IUserRead} from "../interfaces/user/IUserRead";
import {IUserCreate} from "../interfaces/user/IUserCreate";
import {IUserUpdate } from "../interfaces/user/IUserUpdate";
import { IDeliveryFormCreate } from "../interfaces/deliveryforms/IDeliveryFormCreate";
import { ITransportRead } from "../interfaces/transport/ITransportRead";
import { ITransportCreate } from "../interfaces/transport/ITransportCreate";
import { IOrderRead } from "../interfaces/order/IOrderRead";
import { IOrderCreate } from "../interfaces/order/IOrderCreate";
import { IDeliveryFormRead } from "../interfaces/deliveryforms/IDeliveryFormRead";
import { IProductRead } from "../interfaces/product/IProductRead";
import { IProductCreate } from "../interfaces/product/IProductCreate";
import { IOrderUpdate } from "../interfaces/order/IOrderUpdate";
import { IWarehouseStorageRead} from "../interfaces/warehouse/IWarehouseStorageRead";
import { IWarehouseStorageCreate } from "../interfaces/warehouse/IWarehouseStorageCreate";


//Complain API
const Complaint = {
    getAll: () => axiosInstance.get<IComplaintRead[]>('/api/Complaints'),
    getById: (id: number) => axiosInstance.get<IComplaintRead>(`/api/Complaints/${id}`),
    create: (complaint: IComplaintCreate) => axiosInstance.post<IComplaintCreate>('/api/Complaints', complaint), 
    delete: async (id: number) => {
        try {
            await axiosInstance.delete<void>(`/api/Complaints/${id}`);
            console.log("Complaint deleted successfully");
        } catch (error) {
            console.error("Error deleting complaint:", error);
            throw error;
        }
    },
};

//DeliveryForm API
const DeliveryForm = {
    getAll: () => axiosInstance.get<IDeliveryFormRead[]>('/api/DeliveryForms'),
    getById: (id: number) => axiosInstance.get<IDeliveryFormRead>(`/api/DeliveryForms/${id}`),
    create : (deliveryForm: IDeliveryFormCreate) => axiosInstance.post<IDeliveryFormCreate>('/api/DeliveryForms', deliveryForm),
    update : (id : number , status : string) => axiosInstance.put<void>(`/api/DeliveryForms/${id}/status`, { status }),
};

const Products = {
    getAll : () => axiosInstance.get<IProductRead[]>('/api/Products'),
    getById : (id: number) => axiosInstance.get<IProductRead>(`/api/Products/${id}`),
    create : (product: IProductCreate) => axiosInstance.post<IProductCreate>('/api/Products', product),
    delete : (id: number) => axiosInstance.delete<any>(`/api/Products/${id}`),
    update : (id: number, product: IProductCreate) => axiosInstance.put<IProductCreate>(`/api/Products/${id}`, product),
};

//User API
const User = {
    getAll: () => axiosInstance.get<IUserRead[]>('/api/Users'),
    getById: (id: number) => axiosInstance.get<IUserRead>(`/api/Users/${id}`),
    create: (user: IUserCreate) => axiosInstance.post<IUserCreate>('/api/Users/register', user),
    update: (id: number, user: IUserUpdate) => axiosInstance.put<boolean>(`/api/Users/${id}`, user),
    delete: (id: number) => axiosInstance.delete<boolean>(`/api/Users/${id}`),
};

//User Login API for JWT token
const Auth = {login: (email: string, password: string) => axiosInstance.post<{ token: string }>('/api/Users/login', { email, password })};

// Warehouse API
const Warehouse = {
    getAll: () => axiosInstance.get<IWarehouseStorageRead[]>('/api/Warehouse'),
    assign: (WarehouseStorageCreate : IWarehouseStorageCreate) => 
    axiosInstance.post(`/api/Warehouse/update`, WarehouseStorageCreate),
};

// Orders API (Placeholder, as no specific functions were provided)
const Orders = {
    getAll : () => axiosInstance.get<IOrderRead[]>('/api/Orders'),
    getById : (id: number) => axiosInstance.get<IOrderRead>(`/api/Orders/${id}`),
    create : (order: IOrderCreate) => axiosInstance.post<IOrderCreate>('/api/Orders', order),
    update : (id: number, order: IOrderUpdate) => axiosInstance.post<IOrderUpdate>(`/api/Orders/${id}`, order),
    delete : (id: number) => axiosInstance.delete<boolean>(`/api/Orders/${id}`),
    updateStatus:(id : number , payload: { status: string }) => 
    axiosInstance.put<void>(
      `/api/Orders/${id}/status`, 
      payload
    ),
};

export interface TransportUpdateDto {
  status: string;
  endDate: string | null;
}
// Transport API (Placeholder, as no specific functions were provided)
const Transport = {
    getAll: () => axiosInstance.get<ITransportRead[]>('/api/Transports'),
    getById: (id : number) => axiosInstance.get<ITransportRead>(`/api/Transports/${id}`),
    create: (transport : ITransportCreate) => axiosInstance.post<ITransportCreate>('/api/Transports', transport),
    updateStatus: (id: number, payload : TransportUpdateDto) => 
            axiosInstance.put<void>(`/api/Transports/${id}/status`, payload),
};

//Exporting all API functions
const api = {
    Auth,
    Complaint,
    DeliveryForm,
    User,
    Warehouse,
    Orders,
    Transport,
    Products,
}
export default api;