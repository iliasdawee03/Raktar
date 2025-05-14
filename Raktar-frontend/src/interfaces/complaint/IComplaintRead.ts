export interface IComplaintRead {
    id ?: number;
    orderId ?: number;  
    userId ?: number;   
    description ?: string;
    status ?: string;
    createdAt ?: Date;
}