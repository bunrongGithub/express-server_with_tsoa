import itemRepositories from "../database/repositories/items.repositories";
import ItemModel from "../database/models/items.model";
// import { NotFoundError } from "@/src/utils/errors";
// import {IItem} from "@/src/database/models/items.model"
import { ItemCreateRequest } from "../controllers/types/items-request.type";
jest.mock("../database/models/items.model");
describe('itemRepositories', () => {
    afterEach(()=>jest.clearAllMocks());
    describe('createItem',() => {
        it('should create a new item', async() => {
            const productRequest = {name: 'Test Product',price: 100,category:"Test Category"} as ItemCreateRequest;
            const expectedItem = {_id: '1', ...productRequest};
            (ItemModel.create as jest.Mock).mockResolvedValue(expectedItem);

            const result = await itemRepositories.createItem(productRequest);

            expect(ItemModel.create).toHaveBeenCalledWith(productRequest);
            expect(result).toEqual(expectedItem);
        });
        it('should throw an error if item creation fails', async () => {
            const productRequest = {name: 'Test Product', price: 100,category:"Test Category"} as ItemCreateRequest;
            (ItemModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(itemRepositories.createItem(productRequest)).rejects.toThrow('Database error');
        })
    })
});
