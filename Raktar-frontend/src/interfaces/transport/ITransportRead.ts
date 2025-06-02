export interface ITransportRead {
    id: number;
    carrierId: number;
    orderId: number;
    status: string;
    startDate?: Date;
    endDate?: Date;
}