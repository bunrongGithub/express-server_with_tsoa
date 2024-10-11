import { ItemCreateRequest, ItemGetAllRequest, ItemUpdateRequest } from "../controllers/types/items-request.type";
import { IItem } from "../database/models/items.model";
import itemsRepositories from "../database/repositories/items.repositories";
class ItemServices{
    public async createItems(itemRequest: ItemCreateRequest): Promise<IItem>{
        try {
            const newProduct = await itemsRepositories.createItem(itemRequest);
            return newProduct;
        } catch (error) {
            console.log(`ItemServices - createProduct() method error: ${error}`)
            throw error;
        }
    }
    public async getItemById(id: string): Promise<IItem>{
        try {
            const item = await itemsRepositories.getItemById(id);
            return item; 
        } catch (error) {
            throw error;
        }
    }
    public async updateItemById(id: string, itemRequest: ItemUpdateRequest): Promise<IItem>{
        try {
            const updateItem = await itemsRepositories.updateItemById(id,itemRequest);
            return updateItem;
        } catch (error) {
            throw error;
        }
    }
    public async deleteItemById(id: string):Promise<void>{
        try {
            await itemsRepositories.deleteItemById(id);
        } catch (error) {
            throw error;
        }
    }
    public async getAllItems(queries: ItemGetAllRequest){
        try {
            const {page ,limit,filter,sort} = queries;
            const newQueries = {
                page,
                limit,
                filter: filter && JSON.parse(filter),
                sort: sort && JSON.parse(sort)
            }
            const result = await itemsRepositories.getAll(newQueries);
            return result;
        } catch (error) {
            console.error(`ProductService - getAllProducts() method error: ${error}`)
            throw error;
        }
    }
}
export default new ItemServices();