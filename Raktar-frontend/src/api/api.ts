import { IComplaintRead } from "../interfaces/complaint/IComplaintRead";
import {IComplaintCreate} from "../interfaces/complaint/IComplaintCreate";
import axiosInstance from "./axios.config";
import {IUserRead} from "../interfaces/user/IUserRead";
import {IUserCreate} from "../interfaces/user/IUserCreate";
import {IUserUpdate } from "../interfaces/user/IUserUpdate";
import { IDeliveryFormCreate } from "../interfaces/deliveryforms/IDeliveryFormCreate";


//Complain API
const Complaint = {
    getAll: () => axiosInstance.get<IComplaintRead[]>('/api/Complaints'),
    getById: (id: number) => axiosInstance.get<IComplaintRead>(`/api/Complaints/${id}`),
    create: (complaint: IComplaintCreate) => axiosInstance.post<IComplaintRead>('/api/Complaints', complaint), 
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
    getAll: () => axiosInstance.get('/api/DeliveryForms'),
    getById: (id: number) => axiosInstance.get(`/api/DeliveryForms/${id}`),
    create : (deliveryForm: IDeliveryFormCreate) => axiosInstance.post('/api/DeliveryForms', deliveryForm),
};
//User API
const User = {
    getAll: () => axiosInstance.get<IUserRead[]>('/api/Users'),
    getById: (id: number) => axiosInstance.get<IUserRead>(`/api/Users/${id}`),
    create: (user: IUserCreate) => axiosInstance.post<IUserRead>('/api/Users', user),
    update: (id: number, user: IUserUpdate) => axiosInstance.put<boolean>(`/api/Users/${id}`, user),
    delete: (id: number) => axiosInstance.delete<boolean>(`/api/Users/${id}`),
};
//User Loing API for JWT token
const Auth = {login: (email: string, password: string) => axiosInstance.post<{ token: string }>('/api/Users/login', { email, password })};
// Warehouse API
const Warehouse = {
    getAll: () => axiosInstance.get('/api/Warehouse'),
    assign: (productId: number, locationId: string) => axiosInstance.post(`/api/Warehouse/assign`, { productId, locationId }),
};
// Orders API (Placeholder, as no specific functions were provided)
const Orders = {};
//Exporting all API functions
const api = {
    Auth,
    Complaint,
    DeliveryForm,
    User,
    Warehouse,
    Orders,
}
export default api;

