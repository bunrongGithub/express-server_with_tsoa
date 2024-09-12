/** For createion request */
export interface ItemCreateRequest{
    name: string;
    category: string;
    price: number;
}
/** for updation request */
export interface ItemUpdateRequest{
    name?: string;
    category?: string;
    price?:number;
}
/** for get all request */
export interface ItemGetAllRequest{
    page?: number;
    limit?: number;
    filter?: string;
    sort?: string;
}