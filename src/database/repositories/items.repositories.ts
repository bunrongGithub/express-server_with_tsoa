import ItemModel, { IItem } from "../models/items.model";
import { ItemCreateRequest, ItemUpdateRequest } from "../../controllers/types/items-request.type";
import { ItemGetAllRepoParams, ItemSortParams } from "../../database/repositories/types/item-reposity.type";
import { SortOrder } from "mongoose";
import { NotFoundError } from "../../utils/errors";
class ItemRepository {
    public async createItem(productRequest: ItemCreateRequest): Promise<IItem> {
        try {
            const newProduct = await ItemModel.create(productRequest);
            return newProduct;
        } catch (error) {
            throw error;
        }
    }
    public async getItemById(id: string): Promise<IItem> {
        try {
            const item = await ItemModel.findById(id);
            if (!item) {
                throw new NotFoundError('Product not found!');
            }
            return item;
        } catch (error) {
            throw error;
        }
    }
    public async updateItemById(id: string, itemRequest: ItemUpdateRequest): Promise<IItem> {
        try {
            const updateItem = await ItemModel.findByIdAndUpdate(id, itemRequest);
            if (!updateItem) {
                throw new Error("Error Item By id:" + id + " not found!");
            }
            return updateItem;
        } catch (error) {
            throw error;
        }
    }
    public async deleteItemById(id: string) {
        try {
            const deleteItem = await ItemModel.findByIdAndDelete(id);
            if (!deleteItem) {
                throw new Error("Item not found");
            }
        } catch (error) {
            throw error;
        }
    }
    public async getAll(queries: ItemGetAllRepoParams) {
        const { page = 1, limit = 10, filter = {}, sort = { name: 'desc' } } = queries;
        // convert sort from {'field': 'desc' } to {field: -1}
        const sortFields = Object.keys(sort).reduce((acc, key) => {
            const direction = sort[key as keyof ItemSortParams];
            if (direction === 'asc' || direction === 'desc') {
                acc[key as keyof ItemSortParams] = direction === 'asc' ? 1 : -1;
            }
            return acc;
        }, {} as Record<keyof ItemSortParams, SortOrder>);
        // Build MongoDB filter object
        const buildFilter = (filter: Record<string, any>) => {
            const mongoFilter: Record<string, any> = {};
            for (const key in filter) {
                if (typeof filter[key] === 'object') {
                    if (filter[key].hasOwnProperty('min') || filter[key].hasOwnProperty('max')) {
                        mongoFilter[key] = {};
                        if (filter[key].min !== undefined) {
                            mongoFilter[key].$gte = filter[key].min;
                        }
                        if (filter[key].max !== undefined) {
                            mongoFilter[key].$lte = filter[key].max;
                        }
                    } else {
                        mongoFilter[key] = filter[key];
                    }
                }else{
                    mongoFilter[key] = filter[key];
                }
            }
            return mongoFilter;
        }
        try {
            const mongoFilter = buildFilter(filter);
            console.log(mongoFilter);
            const operation = ItemModel.find(mongoFilter)
                .sort(sortFields)
                .skip((page -1) * limit)
                .limit(limit);
            const result = await operation;
            const totalItems = await ItemModel.countDocuments(mongoFilter);
            return {
                [ItemModel.collection.collectionName]: result,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page
            }
        } catch (error) {
            console.error(`ProductRepository - getAll() method error: ${error}`);
            throw error;
        }
    }
}

export default new ItemRepository();