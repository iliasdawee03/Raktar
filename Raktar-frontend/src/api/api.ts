import { IComplaintRead } from "../interfaces/complaint/IComplaintRead";
import {IComplaintCreate} from "../interfaces/complaint/IComplaintCreate";
import axiosInstance from "./axios.config";

const Auth = {login: (email : string, password: string) => axiosInstance.post<{token: string}>('/api/Users/login', {email, password})};

const Complaint = {
    getAll: () => axiosInstance.get<IComplaintRead[]>('/api/Complaints'),
    getById: (id: number) => axiosInstance.get<IComplaintRead>(`/api/Complaints/${id}`), // Felesleges függvény eltávolítva
    create: (complaint: IComplaintCreate) => axiosInstance.post<IComplaintRead>('/api/Complaints', complaint), // Felesleges függvény eltávolítva
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

const api = {
    Auth,
    Complaint,
}
export default api;

