import { IItem } from "../../database/models/items.model";
export interface ItemResponse{
    message: string;
    data: IItem;
}
export interface ItemPaginationResponse{
    message: string;
    data:{
        [key: string]: IItem[] | number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }
}