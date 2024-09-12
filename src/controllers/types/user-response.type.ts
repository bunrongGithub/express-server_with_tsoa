import { IItem } from "../../database/models/items.model";
/** for response to client */
export interface ItemResponse{
    message: string;
    data: IItem;
}
/** for pagination response to client */
export interface ItemPaginationResponse{
    message: string;
    data:{
        [key: string]: IItem[] | number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }
}