/** Import from tsoa */
import { Controller, Route, Post, Body, Response, Middlewares, Get, Path, Put, Delete, Queries } from "tsoa";
/** import items request from type */
import { ItemCreateRequest, ItemGetAllRequest, ItemUpdateRequest } from '../controllers/types/items-request.type';
/** import response item to user from type */
import { ItemPaginationResponse, ItemResponse } from '../controllers/types/user-response.type';
/** import services from service */
import itemService from '../services/item.service';
import validateRequest from '../middlewares/validate-input';
import { itemCreateSchema } from '../database/models/items.model';
import mongoose from "mongoose";
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
          _id: new mongoose.Types.ObjectId,
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
