/** Import from tsoa */
import { Controller, Route, Post, Body, Response, Middlewares, Get, Path, Put, Delete, Queries } from 'tsoa';
/** import items request from type */
import { ItemCreateRequest, ItemGetAllRequest, ItemUpdateRequest } from '@/src/controllers/types/items-request.type';
/** import response item to user from type */
import { ItemPaginationResponse, ItemResponse } from '@/src/controllers/types/user-response.type';
/** import services from service */
import itemService from '@/src/services/item.service';
import validateRequest from '@/src/middlewares/validate-input';
import { itemCreateSchema } from '@/src/database/models/items.model';
/** bast route of item */
@Route("/v1/items")
export class ItemController extends Controller {
  @Post()
  @Response(201, 'Created Success')
  @Middlewares(validateRequest(itemCreateSchema))
  public async createItem(@Body() requestBody: ItemCreateRequest): Promise<ItemResponse> {
    try {
      const newProduct = await itemService.createItems(requestBody);
      return {
        message: "Successfully",
        data: {
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price
        }
      }
    } catch (error) {
      throw error;
    }
  }
  @Get('{id}')
  public async getItemById(@Path() id: string): Promise<ItemResponse> {
    try {
      const item = await itemService.getItemById(id);
      return {
        message: "success",
        data: item
      };
    } catch (error) {
      throw error;
    }
  }
  @Put('{id}')
  public async updateItemById(@Path() id: string, @Body() requestBody: ItemUpdateRequest): Promise<ItemResponse> {
    try {
      const item = await itemService.updateItemById(id, requestBody);
      return {
        message: "success",
        data: item
      }
    } catch (error) {
      throw error;
    }
  }
  @Delete('{id}')
  public async deleteItemById(@Path() id: string): Promise<void> {
    try {
      await itemService.deleteItemById(id);
    } catch (error) {
      throw error;
    }
  }
  @Get()
  public async getAllItems(@Queries() queries: ItemGetAllRequest): Promise<ItemPaginationResponse> {
    try {
      const response = await itemService.getAllItems(queries);
      return {
        message: "success",
        data: response
      }
    } catch (error) {
      console.error(`ProductsController - getAllProducts() method error: ${error}`)
      throw error;
    }
  }
}
