export interface ItemFilterParams{
    category?: string;
}
export interface ItemSortParams{
    name?: 'asc' | 'desc';
    price?: 'asc' | 'desc';
}
export interface ItemGetAllRepoParams{
    page?: number;
    limit?: number;
    filter?: ItemFilterParams;
    sort?: ItemSortParams;
}