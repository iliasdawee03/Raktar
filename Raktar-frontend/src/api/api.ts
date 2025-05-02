import { IComplaintRead } from "../interfaces/complaint/IComplaintRead";
import {IComplaintCreate} from "../interfaces/complaint/IComplaintCreate";
import axiosInstance from "./axios.config";
import {IUserRead} from "../interfaces/user/IUserRead";
import {IUserCreate} from "../interfaces/user/IUserCreate";
import {IUserUpdate } from "../interfaces/user/IUserUpdate";


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

const Auth = {login: (email: string, password: string) => axiosInstance.post<{ token: string }>('/api/Users/login', { email, password })};
const DeliveryForm = {};

const User = {
    getAll: () => axiosInstance.get<IUserRead[]>('/api/Users'),
    getById: (id: number) => axiosInstance.get<IUserRead>(`/api/Users/${id}`),
    create: (user: IUserCreate) => axiosInstance.post<IUserRead>('/api/Users', user),
    update: (id: number, user: IUserUpdate) => axiosInstance.put<boolean>(`/api/Users/${id}`, user),
    delete: (id: number) => axiosInstance.delete<boolean>(`/api/Users/${id}`),
};

const api = {
    Auth,
    Complaint,
    DeliveryForm,
    User,
}
export default api;

