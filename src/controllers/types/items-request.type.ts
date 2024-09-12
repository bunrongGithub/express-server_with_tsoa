export interface ItemCreateRequest{
    name: string;
    category: string;
    price: number;
}
export interface ItemUpdateRequest{
    name?: string;
    category?: string;
    price?:number;
}
export interface ItemGetAllRequest{
    page?: number;
    limit?: number;
    filter?: string;
    sort?: string;
}